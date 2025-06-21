;; Platform Token Contract
;; SIP-010 compliant fungible token for the P2E gaming platform

;; Define the token
(define-fungible-token platform-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-not-authorized (err u104))
(define-constant err-dataset-not-found (err u105))
(define-constant err-stake-not-found (err u106))
(define-constant err-invalid-quality-score (err u107))
(define-constant err-stake-locked (err u108))

;; Token metadata
(define-data-var token-name (string-ascii 32) "P2E Platform Token")
(define-data-var token-symbol (string-ascii 10) "P2E")
(define-data-var token-decimals uint u6)
(define-data-var token-uri (optional (string-utf8 256)) none)

;; Total supply and minting controls
(define-data-var total-supply uint u0)
(define-data-var max-supply uint u1000000000000) ;; 1 million tokens with 6 decimals
(define-data-var minting-enabled bool true)

;; Authorized minters (games, reward contracts, etc.)
(define-data-var authorized-minters (list 10 principal) (list))

;; Staking system
(define-map staking-pools principal {
  staked-amount: uint,
  stake-start-block: uint,
  last-reward-block: uint,
  accumulated-rewards: uint
})

(define-data-var staking-reward-rate uint u100) ;; Rewards per block per token staked
(define-data-var min-stake-duration uint u1008) ;; ~1 week in blocks

;; Governance system (basic)
(define-map proposals uint {
  proposer: principal,
  title: (string-utf8 100),
  description: (string-utf8 500),
  votes-for: uint,
  votes-against: uint,
  end-block: uint,
  executed: bool
})

(define-map votes {proposal-id: uint, voter: principal} {
  amount: uint,
  vote: bool ;; true for yes, false for no
})

(define-data-var last-proposal-id uint u0)
(define-data-var proposal-threshold uint u10000000) ;; 10 tokens to create proposal

;; Data Quality Staking System
(define-map data-quality-stakes {dataset-id: uint, provider: principal} {
  staked-amount: uint,
  stake-start-block: uint,
  quality-score: uint, ;; 0-100 scale
  review-count: uint,
  total-reviews: uint,
  slashed-amount: uint,
  locked-until: uint
})

(define-map quality-reviews {dataset-id: uint, reviewer: principal} {
  score: uint, ;; 0-100 scale
  review-date: uint,
  reviewer-stake: uint,
  verified: bool
})

(define-data-var min-quality-stake uint u1000000) ;; 1 token minimum stake
(define-data-var quality-review-period uint u1440) ;; 24 hours for reviews
(define-data-var slash-percentage uint u2000) ;; 20% slash for poor quality
(define-data-var quality-threshold uint u70) ;; 70% minimum quality score

;; Private functions
(define-private (is-authorized-minter (minter principal))
  (or (is-eq minter contract-owner)
      (is-some (index-of (var-get authorized-minters) minter))))

(define-private (calculate-staking-rewards (staker principal))
  (match (map-get? staking-pools staker)
    staking-data 
      (let ((blocks-staked (- block-height (get last-reward-block staking-data)))
            (reward-amount (/ (* (get staked-amount staking-data) 
                                (var-get staking-reward-rate) 
                                blocks-staked) 
                             u1000000))) ;; Normalize reward calculation
        reward-amount)
    u0))

;; Public functions

;; Mint tokens (only authorized minters)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-authorized-minter tx-sender) err-not-authorized)
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (<= (+ (var-get total-supply) amount) (var-get max-supply)) err-invalid-amount)
    (asserts! (var-get minting-enabled) err-not-authorized)
    
    (try! (ft-mint? platform-token amount recipient))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok true)))

;; Burn tokens
(define-public (burn (amount uint))
  (begin
    (asserts! (> amount u0) err-invalid-amount)
    (try! (ft-burn? platform-token amount tx-sender))
    (var-set total-supply (- (var-get total-supply) amount))
    (ok true)))

;; Transfer tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? platform-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)))

;; Staking functions

;; Stake tokens
(define-public (stake (amount uint))
  (let ((current-stake (default-to {staked-amount: u0, stake-start-block: u0, last-reward-block: u0, accumulated-rewards: u0}
                                  (map-get? staking-pools tx-sender))))
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= (ft-get-balance platform-token tx-sender) amount) err-insufficient-balance)
    
    ;; Calculate and add pending rewards
    (let ((pending-rewards (calculate-staking-rewards tx-sender)))
      
      ;; Transfer tokens to contract for staking
      (try! (ft-transfer? platform-token amount tx-sender (as-contract tx-sender)))
      
      ;; Update staking data
      (map-set staking-pools tx-sender {
        staked-amount: (+ (get staked-amount current-stake) amount),
        stake-start-block: (if (is-eq (get staked-amount current-stake) u0) block-height (get stake-start-block current-stake)),
        last-reward-block: block-height,
        accumulated-rewards: (+ (get accumulated-rewards current-stake) pending-rewards)
      })
      
      (ok true))))

;; Unstake tokens
(define-public (unstake (amount uint))
  (let ((staking-data (unwrap! (map-get? staking-pools tx-sender) err-insufficient-balance)))
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= (get staked-amount staking-data) amount) err-insufficient-balance)
    (asserts! (>= (- block-height (get stake-start-block staking-data)) (var-get min-stake-duration)) err-not-authorized)
    
    ;; Calculate pending rewards
    (let ((pending-rewards (calculate-staking-rewards tx-sender)))
      
      ;; Transfer tokens back to user
      (try! (as-contract (ft-transfer? platform-token amount tx-sender tx-sender)))
      
      ;; Update staking data
      (if (is-eq amount (get staked-amount staking-data))
        ;; Complete unstake
        (map-delete staking-pools tx-sender)
        ;; Partial unstake
        (map-set staking-pools tx-sender {
          staked-amount: (- (get staked-amount staking-data) amount),
          stake-start-block: (get stake-start-block staking-data),
          last-reward-block: block-height,
          accumulated-rewards: (+ (get accumulated-rewards staking-data) pending-rewards)
        }))
      
      (ok true))))

;; Claim staking rewards
(define-public (claim-staking-rewards)
  (let ((staking-data (unwrap! (map-get? staking-pools tx-sender) err-insufficient-balance))
        (pending-rewards (calculate-staking-rewards tx-sender))
        (total-rewards (+ (get accumulated-rewards staking-data) pending-rewards)))
    
    (asserts! (> total-rewards u0) err-invalid-amount)
    
    ;; Mint reward tokens
    (try! (as-contract (ft-mint? platform-token total-rewards tx-sender)))
    (var-set total-supply (+ (var-get total-supply) total-rewards))
    
    ;; Update staking data
    (map-set staking-pools tx-sender 
      (merge staking-data {
        last-reward-block: block-height,
        accumulated-rewards: u0
      }))
    
    (ok total-rewards)))

;; Data Quality Staking Functions

;; Stake tokens against dataset quality
(define-public (stake-for-quality (dataset-id uint) (amount uint))
  (begin
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= amount (var-get min-quality-stake)) err-invalid-amount)
    (asserts! (>= (ft-get-balance platform-token tx-sender) amount) err-insufficient-balance)

    ;; Check if already staked for this dataset
    (asserts! (is-none (map-get? data-quality-stakes {dataset-id: dataset-id, provider: tx-sender})) err-not-authorized)

    ;; Transfer tokens to contract
    (try! (ft-transfer? platform-token amount tx-sender (as-contract tx-sender)))

    ;; Create quality stake
    (map-set data-quality-stakes {dataset-id: dataset-id, provider: tx-sender} {
      staked-amount: amount,
      stake-start-block: block-height,
      quality-score: u100, ;; Start with perfect score
      review-count: u0,
      total-reviews: u0,
      slashed-amount: u0,
      locked-until: (+ block-height (var-get quality-review-period))
    })

    (ok true)))

;; Submit quality review for a dataset
(define-public (submit-quality-review (dataset-id uint) (provider principal) (score uint) (reviewer-stake uint))
  (let ((stake-data (unwrap! (map-get? data-quality-stakes {dataset-id: dataset-id, provider: provider}) err-stake-not-found)))

    (asserts! (and (>= score u0) (<= score u100)) err-invalid-quality-score)
    (asserts! (> reviewer-stake u0) err-invalid-amount)
    (asserts! (>= (ft-get-balance platform-token tx-sender) reviewer-stake) err-insufficient-balance)
    (asserts! (not (is-eq tx-sender provider)) err-not-authorized) ;; Can't review own dataset

    ;; Check if already reviewed
    (asserts! (is-none (map-get? quality-reviews {dataset-id: dataset-id, reviewer: tx-sender})) err-not-authorized)

    ;; Transfer reviewer stake
    (try! (ft-transfer? platform-token reviewer-stake tx-sender (as-contract tx-sender)))

    ;; Record review
    (map-set quality-reviews {dataset-id: dataset-id, reviewer: tx-sender} {
      score: score,
      review-date: block-height,
      reviewer-stake: reviewer-stake,
      verified: true
    })

    ;; Update quality stake with new average score
    (let ((new-total-reviews (+ (get total-reviews stake-data) u1))
          (current-total-score (* (get quality-score stake-data) (get review-count stake-data)))
          (new-total-score (+ current-total-score score))
          (new-average-score (/ new-total-score new-total-reviews)))

      (map-set data-quality-stakes {dataset-id: dataset-id, provider: provider}
        (merge stake-data {
          quality-score: new-average-score,
          review-count: (+ (get review-count stake-data) u1),
          total-reviews: new-total-reviews
        })))

    (ok true)))

;; Slash stake for poor quality (automated or admin triggered)
(define-public (slash-quality-stake (dataset-id uint) (provider principal))
  (let ((stake-data (unwrap! (map-get? data-quality-stakes {dataset-id: dataset-id, provider: provider}) err-stake-not-found)))

    ;; Only allow slashing if quality score is below threshold and has enough reviews
    (asserts! (< (get quality-score stake-data) (var-get quality-threshold)) err-not-authorized)
    (asserts! (>= (get review-count stake-data) u3) err-not-authorized) ;; Need at least 3 reviews

    ;; Calculate slash amount
    (let ((slash-amount (/ (* (get staked-amount stake-data) (var-get slash-percentage)) u10000))
          (remaining-amount (- (get staked-amount stake-data) slash-amount)))

      ;; Update stake data
      (map-set data-quality-stakes {dataset-id: dataset-id, provider: provider}
        (merge stake-data {
          staked-amount: remaining-amount,
          slashed-amount: (+ (get slashed-amount stake-data) slash-amount),
          locked-until: (+ block-height u1440) ;; Lock for another 24 hours
        }))

      ;; Burn slashed tokens (remove from circulation)
      (try! (as-contract (ft-burn? platform-token slash-amount tx-sender)))
      (var-set total-supply (- (var-get total-supply) slash-amount))

      (ok slash-amount))))

;; Withdraw quality stake (after review period)
(define-public (withdraw-quality-stake (dataset-id uint))
  (let ((stake-data (unwrap! (map-get? data-quality-stakes {dataset-id: dataset-id, provider: tx-sender}) err-stake-not-found)))

    (asserts! (>= block-height (get locked-until stake-data)) err-stake-locked)
    (asserts! (> (get staked-amount stake-data) u0) err-insufficient-balance)

    ;; Transfer remaining stake back to provider
    (try! (as-contract (ft-transfer? platform-token (get staked-amount stake-data) tx-sender tx-sender)))

    ;; Remove stake record
    (map-delete data-quality-stakes {dataset-id: dataset-id, provider: tx-sender})

    (ok (get staked-amount stake-data))))

;; Claim reviewer rewards (for accurate reviews)
(define-public (claim-reviewer-rewards (dataset-id uint) (provider principal))
  (let ((review (unwrap! (map-get? quality-reviews {dataset-id: dataset-id, reviewer: tx-sender}) err-not-authorized))
        (stake-data (unwrap! (map-get? data-quality-stakes {dataset-id: dataset-id, provider: provider}) err-stake-not-found)))

    ;; Only allow claiming if review was accurate (within 10 points of final score)
    (let ((score-diff (if (> (get score review) (get quality-score stake-data))
                        (- (get score review) (get quality-score stake-data))
                        (- (get quality-score stake-data) (get score review)))))

      (asserts! (<= score-diff u10) err-not-authorized) ;; Review must be within 10 points

      ;; Calculate reward (return stake + bonus)
      (let ((reward-amount (+ (get reviewer-stake review) (/ (get reviewer-stake review) u10)))) ;; 10% bonus

        ;; Transfer reward
        (try! (as-contract (ft-transfer? platform-token reward-amount tx-sender tx-sender)))

        ;; Remove review record
        (map-delete quality-reviews {dataset-id: dataset-id, reviewer: tx-sender})

        (ok reward-amount)))))

;; Governance functions

;; Create proposal
(define-public (create-proposal (title (string-utf8 100)) (description (string-utf8 500)) (voting-duration uint))
  (let ((proposal-id (+ (var-get last-proposal-id) u1)))
    (asserts! (>= (ft-get-balance platform-token tx-sender) (var-get proposal-threshold)) err-insufficient-balance)
    
    (map-set proposals proposal-id {
      proposer: tx-sender,
      title: title,
      description: description,
      votes-for: u0,
      votes-against: u0,
      end-block: (+ block-height voting-duration),
      executed: false
    })
    
    (var-set last-proposal-id proposal-id)
    (ok proposal-id)))

;; Vote on proposal
(define-public (vote (proposal-id uint) (vote-yes bool) (amount uint))
  (let ((proposal (unwrap! (map-get? proposals proposal-id) err-invalid-amount)))
    (asserts! (< block-height (get end-block proposal)) err-not-authorized)
    (asserts! (>= (ft-get-balance platform-token tx-sender) amount) err-insufficient-balance)
    (asserts! (is-none (map-get? votes {proposal-id: proposal-id, voter: tx-sender})) err-not-authorized)
    
    ;; Record vote
    (map-set votes {proposal-id: proposal-id, voter: tx-sender} {
      amount: amount,
      vote: vote-yes
    })
    
    ;; Update proposal vote counts
    (map-set proposals proposal-id 
      (if vote-yes
        (merge proposal {votes-for: (+ (get votes-for proposal) amount)})
        (merge proposal {votes-against: (+ (get votes-against proposal) amount)})))
    
    (ok true)))

;; Admin functions

(define-public (add-authorized-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set authorized-minters (unwrap-panic (as-max-len? (append (var-get authorized-minters) minter) u10)))
    (ok true)))

(define-public (set-minting-enabled (enabled bool))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set minting-enabled enabled)
    (ok true)))

(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set token-uri new-uri)
    (ok true)))

;; Data Quality Staking admin functions

(define-public (set-min-quality-stake (new-amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set min-quality-stake new-amount)
    (ok true)))

(define-public (set-quality-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (and (>= new-threshold u0) (<= new-threshold u100)) err-invalid-quality-score)
    (var-set quality-threshold new-threshold)
    (ok true)))

(define-public (set-slash-percentage (new-percentage uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-percentage u5000) err-invalid-amount) ;; Max 50% slash
    (var-set slash-percentage new-percentage)
    (ok true)))

;; SIP-010 Standard Functions

(define-read-only (get-name)
  (ok (var-get token-name)))

(define-read-only (get-symbol)
  (ok (var-get token-symbol)))

(define-read-only (get-decimals)
  (ok (var-get token-decimals)))

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance platform-token who)))

(define-read-only (get-total-supply)
  (ok (var-get total-supply)))

(define-read-only (get-token-uri)
  (ok (var-get token-uri)))

;; Additional read-only functions

(define-read-only (get-staking-data (staker principal))
  (map-get? staking-pools staker))

(define-read-only (get-pending-rewards (staker principal))
  (ok (calculate-staking-rewards staker)))

(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals proposal-id))

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes {proposal-id: proposal-id, voter: voter}))

;; Data Quality Staking read-only functions

(define-read-only (get-quality-stake (dataset-id uint) (provider principal))
  (map-get? data-quality-stakes {dataset-id: dataset-id, provider: provider}))

(define-read-only (get-quality-review (dataset-id uint) (reviewer principal))
  (map-get? quality-reviews {dataset-id: dataset-id, reviewer: reviewer}))

(define-read-only (get-dataset-quality-score (dataset-id uint) (provider principal))
  (match (map-get? data-quality-stakes {dataset-id: dataset-id, provider: provider})
    stake-data (some (get quality-score stake-data))
    none))

(define-read-only (is-quality-stake-locked (dataset-id uint) (provider principal))
  (match (map-get? data-quality-stakes {dataset-id: dataset-id, provider: provider})
    stake-data (> (get locked-until stake-data) block-height)
    false))

(define-read-only (get-min-quality-stake)
  (var-get min-quality-stake))

(define-read-only (get-quality-threshold)
  (var-get quality-threshold))
