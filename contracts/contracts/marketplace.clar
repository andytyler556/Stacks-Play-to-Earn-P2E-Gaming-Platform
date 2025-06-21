;; Marketplace Contract
;; Decentralized marketplace for trading NFTs and tokens

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-listing-not-found (err u102))
(define-constant err-listing-not-active (err u103))
(define-constant err-insufficient-payment (err u104))
(define-constant err-invalid-price (err u105))
(define-constant err-cannot-buy-own-listing (err u106))
(define-constant err-invalid-fee-rate (err u107))
(define-constant err-dataset-not-found (err u108))
(define-constant err-already-purchased (err u109))
(define-constant err-contract-call-failed (err u110))

;; Data variables
(define-data-var last-listing-id uint u0)
(define-data-var platform-fee-rate uint u250) ;; 2.5% in basis points
(define-data-var platform-treasury principal tx-sender)
(define-data-var dataset-registry-contract principal tx-sender) ;; Will be set to actual contract address

;; Listing data structure
(define-map listings uint {
  seller: principal,
  nft-contract: principal,
  token-id: uint,
  price: uint,
  currency: (string-ascii 10), ;; "STX", "sBTC", etc.
  is-active: bool,
  created-at: uint,
  expires-at: (optional uint)
})

;; Offer data structure (for bidding)
(define-map offers uint {
  buyer: principal,
  listing-id: uint,
  amount: uint,
  currency: (string-ascii 10),
  expires-at: uint,
  is-active: bool
})

(define-data-var last-offer-id uint u0)

;; Sales history
(define-map sales-history uint {
  listing-id: uint,
  seller: principal,
  buyer: principal,
  nft-contract: principal,
  token-id: uint,
  price: uint,
  currency: (string-ascii 10),
  platform-fee: uint,
  sold-at: uint
})

(define-data-var last-sale-id uint u0)

;; Dataset purchase tracking
(define-map dataset-purchases {dataset-id: uint, buyer: principal} {
  purchase-price: uint,
  purchased-at: uint,
  royalty-paid: uint
})

;; Private functions
(define-private (next-listing-id)
  (begin
    (var-set last-listing-id (+ (var-get last-listing-id) u1))
    (var-get last-listing-id)))

(define-private (next-offer-id)
  (begin
    (var-set last-offer-id (+ (var-get last-offer-id) u1))
    (var-get last-offer-id)))

(define-private (next-sale-id)
  (begin
    (var-set last-sale-id (+ (var-get last-sale-id) u1))
    (var-get last-sale-id)))

(define-private (calculate-platform-fee (price uint))
  (/ (* price (var-get platform-fee-rate)) u10000))

(define-private (calculate-royalty (price uint) (royalty-rate uint))
  (/ (* price royalty-rate) u10000))

;; Public functions

;; List NFT for sale
(define-public (list-nft (nft-contract <nft-trait>) (token-id uint) (price uint) (currency (string-ascii 10)) (duration (optional uint)))
  (let ((listing-id (next-listing-id))
        (expires-at (match duration
                      some-duration (some (+ block-height some-duration))
                      none)))
    (asserts! (> price u0) err-invalid-price)
    
    ;; Verify ownership (this would need to be implemented based on the specific NFT contract interface)
    ;; For now, we'll assume the caller owns the NFT
    
    ;; Create listing
    (map-set listings listing-id {
      seller: tx-sender,
      nft-contract: (contract-of nft-contract),
      token-id: token-id,
      price: price,
      currency: currency,
      is-active: true,
      created-at: block-height,
      expires-at: expires-at
    })
    
    (ok listing-id)))

;; Buy NFT from listing
(define-public (buy-nft (listing-id uint))
  (let ((listing (unwrap! (map-get? listings listing-id) err-listing-not-found))
        (platform-fee (calculate-platform-fee (get price listing)))
        (seller-amount (- (get price listing) platform-fee))
        (sale-id (next-sale-id)))
    
    (asserts! (get is-active listing) err-listing-not-active)
    (asserts! (not (is-eq tx-sender (get seller listing))) err-cannot-buy-own-listing)
    
    ;; Check if listing has expired
    (match (get expires-at listing)
      some-expiry (asserts! (< block-height some-expiry) err-listing-not-active)
      none)
    
    ;; Transfer payment (STX for now)
    (if (is-eq (get currency listing) "STX")
      (begin
        ;; Transfer STX to seller
        (try! (stx-transfer? seller-amount tx-sender (get seller listing)))
        ;; Transfer platform fee to treasury
        (try! (stx-transfer? platform-fee tx-sender (var-get platform-treasury))))
      (err u999)) ;; Other currencies not implemented yet
    
    ;; Mark listing as inactive
    (map-set listings listing-id (merge listing {is-active: false}))
    
    ;; Record sale
    (map-set sales-history sale-id {
      listing-id: listing-id,
      seller: (get seller listing),
      buyer: tx-sender,
      nft-contract: (get nft-contract listing),
      token-id: (get token-id listing),
      price: (get price listing),
      currency: (get currency listing),
      platform-fee: platform-fee,
      sold-at: block-height
    })
    
    (ok sale-id)))

;; Cancel listing
(define-public (cancel-listing (listing-id uint))
  (let ((listing (unwrap! (map-get? listings listing-id) err-listing-not-found)))
    (asserts! (is-eq tx-sender (get seller listing)) err-not-token-owner)
    (asserts! (get is-active listing) err-listing-not-active)
    
    ;; Mark listing as inactive
    (map-set listings listing-id (merge listing {is-active: false}))
    
    (ok true)))

;; Make offer on listing
(define-public (make-offer (listing-id uint) (amount uint) (currency (string-ascii 10)) (duration uint))
  (let ((listing (unwrap! (map-get? listings listing-id) err-listing-not-found))
        (offer-id (next-offer-id)))
    
    (asserts! (get is-active listing) err-listing-not-active)
    (asserts! (> amount u0) err-invalid-price)
    (asserts! (not (is-eq tx-sender (get seller listing))) err-cannot-buy-own-listing)
    
    ;; Create offer
    (map-set offers offer-id {
      buyer: tx-sender,
      listing-id: listing-id,
      amount: amount,
      currency: currency,
      expires-at: (+ block-height duration),
      is-active: true
    })
    
    (ok offer-id)))

;; Accept offer
(define-public (accept-offer (offer-id uint))
  (let ((offer (unwrap! (map-get? offers offer-id) err-listing-not-found))
        (listing (unwrap! (map-get? listings (get listing-id offer)) err-listing-not-found))
        (platform-fee (calculate-platform-fee (get amount offer)))
        (seller-amount (- (get amount offer) platform-fee))
        (sale-id (next-sale-id)))
    
    (asserts! (is-eq tx-sender (get seller listing)) err-not-token-owner)
    (asserts! (get is-active offer) err-listing-not-active)
    (asserts! (get is-active listing) err-listing-not-active)
    (asserts! (< block-height (get expires-at offer)) err-listing-not-active)
    
    ;; Transfer payment (STX for now)
    (if (is-eq (get currency offer) "STX")
      (begin
        ;; Transfer STX to seller
        (try! (stx-transfer? seller-amount (get buyer offer) tx-sender))
        ;; Transfer platform fee to treasury
        (try! (stx-transfer? platform-fee (get buyer offer) (var-get platform-treasury))))
      (err u999)) ;; Other currencies not implemented yet
    
    ;; Mark listing and offer as inactive
    (map-set listings (get listing-id offer) (merge listing {is-active: false}))
    (map-set offers offer-id (merge offer {is-active: false}))
    
    ;; Record sale
    (map-set sales-history sale-id {
      listing-id: (get listing-id offer),
      seller: tx-sender,
      buyer: (get buyer offer),
      nft-contract: (get nft-contract listing),
      token-id: (get token-id listing),
      price: (get amount offer),
      currency: (get currency offer),
      platform-fee: platform-fee,
      sold-at: block-height
    })
    
    (ok sale-id)))

;; Dataset marketplace functions

;; Purchase dataset with automatic royalty distribution
(define-public (purchase-dataset (dataset-id uint))
  (let ((dataset-registry (var-get dataset-registry-contract)))
    ;; Get dataset information from registry contract
    (match (contract-call? dataset-registry get-dataset dataset-id)
      dataset-info (let ((dataset (unwrap! dataset-info err-dataset-not-found))
                        (price (get price dataset))
                        (owner (get owner dataset))
                        (royalty-rate (get royalty-rate dataset))
                        (platform-fee (calculate-platform-fee price))
                        (royalty-amount (calculate-royalty price royalty-rate))
                        (seller-amount (- (- price platform-fee) royalty-amount)))

        ;; Validate dataset is active
        (asserts! (get active dataset) err-listing-not-active)
        ;; Prevent buying own dataset
        (asserts! (not (is-eq tx-sender owner)) err-cannot-buy-own-listing)
        ;; Check if already purchased
        (asserts! (is-none (map-get? dataset-purchases {dataset-id: dataset-id, buyer: tx-sender})) err-already-purchased)

        ;; Transfer payments
        ;; 1. Platform fee to treasury
        (try! (stx-transfer? platform-fee tx-sender (var-get platform-treasury)))
        ;; 2. Royalty to original data provider (owner)
        (try! (stx-transfer? royalty-amount tx-sender owner))
        ;; 3. Remaining amount to current seller (in this case, same as owner)
        (try! (stx-transfer? seller-amount tx-sender owner))

        ;; Grant access through dataset registry
        (try! (contract-call? dataset-registry grant-access dataset-id tx-sender))

        ;; Record purchase
        (map-set dataset-purchases {dataset-id: dataset-id, buyer: tx-sender} {
          purchase-price: price,
          purchased-at: block-height,
          royalty-paid: royalty-amount
        })

        ;; Update dataset sales count (would need to be implemented in dataset registry)
        ;; For now, we'll just return success
        (ok dataset-id))
      err-dataset-not-found)))

;; Admin functions

(define-public (set-platform-fee-rate (new-rate uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-rate u1000) err-invalid-fee-rate) ;; Max 10%
    (var-set platform-fee-rate new-rate)
    (ok true)))

(define-public (set-platform-treasury (new-treasury principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set platform-treasury new-treasury)
    (ok true)))

(define-public (set-dataset-registry-contract (new-contract principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set dataset-registry-contract new-contract)
    (ok true)))

;; Read-only functions

(define-read-only (get-listing (listing-id uint))
  (map-get? listings listing-id))

(define-read-only (get-offer (offer-id uint))
  (map-get? offers offer-id))

(define-read-only (get-sale (sale-id uint))
  (map-get? sales-history sale-id))

(define-read-only (get-platform-fee-rate)
  (var-get platform-fee-rate))

(define-read-only (get-platform-treasury)
  (var-get platform-treasury))

(define-read-only (get-last-listing-id)
  (var-get last-listing-id))

(define-read-only (get-last-offer-id)
  (var-get last-offer-id))

(define-read-only (get-last-sale-id)
  (var-get last-sale-id))

(define-read-only (get-dataset-purchase (dataset-id uint) (buyer principal))
  (map-get? dataset-purchases {dataset-id: dataset-id, buyer: buyer}))

(define-read-only (get-dataset-registry-contract)
  (var-get dataset-registry-contract))

;; NFT trait for marketplace interactions
(define-trait nft-trait
  (
    (get-last-token-id () (response uint uint))
    (get-token-uri (uint) (response (optional (string-utf8 256)) uint))
    (get-owner (uint) (response (optional principal) uint))
    (transfer (uint principal principal) (response bool uint))
  )
)
