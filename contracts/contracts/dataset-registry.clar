;; Dataset Registry Contract with Multi-Signature Authorization
;; Manages dataset registration, metadata, and ownership with multi-sig security

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-dataset-not-found (err u102))
(define-constant err-dataset-already-exists (err u103))
(define-constant err-invalid-price (err u104))
(define-constant err-proposal-not-found (err u105))
(define-constant err-proposal-expired (err u106))
(define-constant err-already-signed (err u107))
(define-constant err-insufficient-signatures (err u108))
(define-constant err-proposal-already-executed (err u109))
(define-constant err-invalid-threshold (err u110))

;; Data variables
(define-data-var last-dataset-id uint u0)
(define-data-var last-proposal-id uint u0)
(define-data-var signature-threshold uint u2) ;; Minimum signatures required
(define-data-var proposal-expiry-blocks uint u1440) ;; ~24 hours at 1 min/block

;; Multi-signature authorized signers
(define-data-var authorized-signers (list 10 principal) (list))

;; Dataset data structure
(define-map datasets uint {
  owner: principal,
  uri: (string-utf8 256),
  price: uint,
  metadata: (string-utf8 512),
  created-at: uint,
  updated-at: uint,
  total-sales: uint,
  rating: uint,
  rating-count: uint,
  active: bool,
  royalty-rate: uint ;; Basis points (e.g., 500 = 5%)
})

;; Multi-signature proposals for high-value operations
(define-map proposals uint {
  proposer: principal,
  operation-type: (string-ascii 20), ;; "register", "update", "deactivate"
  dataset-id: uint,
  dataset-data: (optional {
    owner: principal,
    uri: (string-utf8 256),
    price: uint,
    metadata: (string-utf8 512),
    royalty-rate: uint
  }),
  signatures: (list 10 principal),
  signature-count: uint,
  created-at: uint,
  expires-at: uint,
  executed: bool
})

;; Access tracking for purchased datasets
(define-map dataset-access {dataset-id: uint, buyer: principal} {
  granted-at: uint,
  expires-at: (optional uint)
})

;; Helper functions

(define-private (next-dataset-id)
  (begin
    (var-set last-dataset-id (+ (var-get last-dataset-id) u1))
    (var-get last-dataset-id)))

(define-private (next-proposal-id)
  (begin
    (var-set last-proposal-id (+ (var-get last-proposal-id) u1))
    (var-get last-proposal-id)))

(define-private (is-authorized-signer (signer principal))
  (is-some (index-of (var-get authorized-signers) signer)))

(define-private (is-high-value-operation (price uint))
  (>= price u1000000)) ;; 1 STX threshold for multi-sig

;; Admin functions

(define-public (add-authorized-signer (signer principal))
  (let ((current-signers (var-get authorized-signers)))
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-none (index-of current-signers signer)) (err u111))
    (var-set authorized-signers (unwrap! (as-max-len? (append current-signers signer) u10) (err u112)))
    (ok true)))

(define-public (remove-authorized-signer (signer principal))
  (let ((current-signers (var-get authorized-signers)))
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set authorized-signers (filter is-not-target current-signers))
    (ok true)))

(define-private (is-not-target (item principal))
  (not (is-eq item tx-sender)))

(define-public (set-signature-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (and (>= new-threshold u1) (<= new-threshold u10)) err-invalid-threshold)
    (var-set signature-threshold new-threshold)
    (ok true)))

;; Dataset registration functions

(define-public (register-dataset (uri (string-utf8 256)) (price uint) (metadata (string-utf8 512)) (royalty-rate uint))
  (let ((dataset-id (next-dataset-id)))
    (asserts! (> price u0) err-invalid-price)
    (asserts! (<= royalty-rate u1000) (err u113)) ;; Max 10% royalty
    
    (if (is-high-value-operation price)
      ;; High-value operation requires multi-sig
      (create-dataset-proposal "register" dataset-id (some {
        owner: tx-sender,
        uri: uri,
        price: price,
        metadata: metadata,
        royalty-rate: royalty-rate
      }))
      ;; Low-value operation can be executed directly
      (begin
        (map-set datasets dataset-id {
          owner: tx-sender,
          uri: uri,
          price: price,
          metadata: metadata,
          created-at: block-height,
          updated-at: block-height,
          total-sales: u0,
          rating: u0,
          rating-count: u0,
          active: true,
          royalty-rate: royalty-rate
        })
        (ok dataset-id)))))

(define-private (create-dataset-proposal (operation (string-ascii 20)) (dataset-id uint) (data (optional {owner: principal, uri: (string-utf8 256), price: uint, metadata: (string-utf8 512), royalty-rate: uint})))
  (let ((proposal-id (next-proposal-id)))
    (map-set proposals proposal-id {
      proposer: tx-sender,
      operation-type: operation,
      dataset-id: dataset-id,
      dataset-data: data,
      signatures: (list),
      signature-count: u0,
      created-at: block-height,
      expires-at: (+ block-height (var-get proposal-expiry-blocks)),
      executed: false
    })
    (ok proposal-id)))

;; Multi-signature functions

(define-public (sign-proposal (proposal-id uint))
  (let ((proposal (unwrap! (map-get? proposals proposal-id) err-proposal-not-found)))
    (asserts! (is-authorized-signer tx-sender) err-not-authorized)
    (asserts! (< block-height (get expires-at proposal)) err-proposal-expired)
    (asserts! (not (get executed proposal)) err-proposal-already-executed)
    (asserts! (is-none (index-of (get signatures proposal) tx-sender)) err-already-signed)
    
    (let ((new-signatures (unwrap! (as-max-len? (append (get signatures proposal) tx-sender) u10) (err u114)))
          (new-count (+ (get signature-count proposal) u1)))
      (map-set proposals proposal-id (merge proposal {
        signatures: new-signatures,
        signature-count: new-count
      }))
      (ok true))))

(define-public (execute-proposal (proposal-id uint))
  (let ((proposal (unwrap! (map-get? proposals proposal-id) err-proposal-not-found)))
    (asserts! (>= (get signature-count proposal) (var-get signature-threshold)) err-insufficient-signatures)
    (asserts! (< block-height (get expires-at proposal)) err-proposal-expired)
    (asserts! (not (get executed proposal)) err-proposal-already-executed)
    
    ;; Mark proposal as executed
    (map-set proposals proposal-id (merge proposal {executed: true}))
    
    ;; Execute the operation based on type
    (if (is-eq (get operation-type proposal) "register")
      (execute-register-dataset proposal)
      (if (is-eq (get operation-type proposal) "update")
        (execute-update-dataset proposal)
        (execute-deactivate-dataset proposal)))))

(define-private (execute-register-dataset (proposal {proposer: principal, operation-type: (string-ascii 20), dataset-id: uint, dataset-data: (optional {owner: principal, uri: (string-utf8 256), price: uint, metadata: (string-utf8 512), royalty-rate: uint}), signatures: (list 10 principal), signature-count: uint, created-at: uint, expires-at: uint, executed: bool}))
  (let ((data (unwrap! (get dataset-data proposal) (err u115))))
    (map-set datasets (get dataset-id proposal) {
      owner: (get owner data),
      uri: (get uri data),
      price: (get price data),
      metadata: (get metadata data),
      created-at: (get created-at proposal),
      updated-at: block-height,
      total-sales: u0,
      rating: u0,
      rating-count: u0,
      active: true,
      royalty-rate: (get royalty-rate data)
    })
    (ok (get dataset-id proposal))))

(define-private (execute-update-dataset (proposal {proposer: principal, operation-type: (string-ascii 20), dataset-id: uint, dataset-data: (optional {owner: principal, uri: (string-utf8 256), price: uint, metadata: (string-utf8 512), royalty-rate: uint}), signatures: (list 10 principal), signature-count: uint, created-at: uint, expires-at: uint, executed: bool}))
  (let ((dataset (unwrap! (map-get? datasets (get dataset-id proposal)) err-dataset-not-found))
        (data (unwrap! (get dataset-data proposal) (err u115))))
    (map-set datasets (get dataset-id proposal) (merge dataset {
      uri: (get uri data),
      price: (get price data),
      metadata: (get metadata data),
      updated-at: block-height,
      royalty-rate: (get royalty-rate data)
    }))
    (ok (get dataset-id proposal))))

(define-private (execute-deactivate-dataset (proposal {proposer: principal, operation-type: (string-ascii 20), dataset-id: uint, dataset-data: (optional {owner: principal, uri: (string-utf8 256), price: uint, metadata: (string-utf8 512), royalty-rate: uint}), signatures: (list 10 principal), signature-count: uint, created-at: uint, expires-at: uint, executed: bool}))
  (let ((dataset (unwrap! (map-get? datasets (get dataset-id proposal)) err-dataset-not-found)))
    (map-set datasets (get dataset-id proposal) (merge dataset {
      active: false,
      updated-at: block-height
    }))
    (ok (get dataset-id proposal))))

;; Access control functions

(define-public (grant-access (dataset-id uint) (buyer principal))
  (let ((dataset (unwrap! (map-get? datasets dataset-id) err-dataset-not-found)))
    ;; This function should be called by the marketplace contract
    (map-set dataset-access {dataset-id: dataset-id, buyer: buyer} {
      granted-at: block-height,
      expires-at: none
    })
    (ok true)))

;; Read-only functions

(define-read-only (get-dataset (dataset-id uint))
  (map-get? datasets dataset-id))

(define-read-only (has-access (dataset-id uint) (buyer principal))
  (is-some (map-get? dataset-access {dataset-id: dataset-id, buyer: buyer})))

(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals proposal-id))

(define-read-only (get-signature-threshold)
  (var-get signature-threshold))

(define-read-only (get-authorized-signers)
  (var-get authorized-signers))
