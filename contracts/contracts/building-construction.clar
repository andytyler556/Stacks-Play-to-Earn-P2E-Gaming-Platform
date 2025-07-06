;; Building Construction Contract
;; Enables players to build structures on their land using blueprints
;; Core P2E mechanic for resource generation and gameplay progression

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-land-not-found (err u102))
(define-constant err-not-land-owner (err u103))
(define-constant err-blueprint-not-found (err u104))
(define-constant err-not-blueprint-owner (err u105))
(define-constant err-insufficient-resources (err u106))
(define-constant err-building-limit-exceeded (err u107))
(define-constant err-building-not-found (err u108))
(define-constant err-building-under-construction (err u109))
(define-constant err-invalid-building-type (err u110))
(define-constant err-no-resources-to-collect (err u111))

;; Data variables
(define-data-var last-building-id uint u0)
(define-data-var construction-time-blocks uint u144) ;; ~24 hours at 10min blocks
(define-data-var resource-generation-interval uint u144) ;; Daily resource generation

;; Building data structure
(define-map buildings uint {
  land-id: uint,
  blueprint-id: uint,
  owner: principal,
  building-type: (string-ascii 20),
  built-at: uint,
  last-harvest: uint,
  level: uint,
  status: (string-ascii 20), ;; "under-construction", "active", "demolished"
  daily-production: {
    wood: uint,
    stone: uint,
    metal: uint,
    energy: uint,
    tokens: uint
  }
})

;; Land to building mapping (one building per land plot)
(define-map land-buildings uint uint) ;; land-id -> building-id

;; Player resource balances
(define-map player-resources principal {
  wood: uint,
  stone: uint,
  metal: uint,
  energy: uint,
  last-updated: uint
})

;; Building type templates for production rates
(define-map building-production-rates (string-ascii 20) {
  base-wood: uint,
  base-stone: uint,
  base-metal: uint,
  base-energy: uint,
  base-tokens: uint
})

;; Initialize building production rates
(map-set building-production-rates "residential" {
  base-wood: u0,
  base-stone: u0,
  base-metal: u0,
  base-energy: u5,
  base-tokens: u10
})

(map-set building-production-rates "commercial" {
  base-wood: u2,
  base-stone: u1,
  base-metal: u1,
  base-energy: u0,
  base-tokens: u25
})

(map-set building-production-rates "industrial" {
  base-wood: u5,
  base-stone: u8,
  base-metal: u12,
  base-energy: u0,
  base-tokens: u15
})

(map-set building-production-rates "decorative" {
  base-wood: u1,
  base-stone: u1,
  base-metal: u0,
  base-energy: u2,
  base-tokens: u5
})

;; Private functions

(define-private (next-building-id)
  (begin
    (var-set last-building-id (+ (var-get last-building-id) u1))
    (var-get last-building-id)))

(define-private (get-land-owner (land-id uint))
  (contract-call? .land-nft get-owner land-id))

(define-private (get-blueprint-owner (blueprint-id uint))
  (contract-call? .blueprint-nft get-owner blueprint-id))

(define-private (get-blueprint-data (blueprint-id uint))
  (contract-call? .blueprint-nft get-blueprint-data blueprint-id))

(define-private (get-land-data (land-id uint))
  (contract-call? .land-nft get-land-data land-id))

(define-private (calculate-construction-cost (blueprint-data {building-type: (string-ascii 20), resource-consumption: {wood: uint, stone: uint, metal: uint, energy: uint}, output: {population-capacity: uint, resource-generation: uint, defense-bonus: uint, happiness-bonus: uint}, rarity: (string-ascii 10), build-time: uint, maintenance-cost: uint, created-at: uint}))
  (get resource-consumption blueprint-data))

(define-private (calculate-production-rates (building-type (string-ascii 20)) (rarity (string-ascii 10)) (terrain-multiplier uint))
  (let ((base-rates (unwrap-panic (map-get? building-production-rates building-type)))
        (rarity-multiplier (if (is-eq rarity "legendary") u300
                          (if (is-eq rarity "epic") u200
                          (if (is-eq rarity "rare") u150
                          (if (is-eq rarity "uncommon") u125
                            u100))))))
    {
      wood: (/ (* (get base-wood base-rates) rarity-multiplier terrain-multiplier) u10000),
      stone: (/ (* (get base-stone base-rates) rarity-multiplier terrain-multiplier) u10000),
      metal: (/ (* (get base-metal base-rates) rarity-multiplier terrain-multiplier) u10000),
      energy: (/ (* (get base-energy base-rates) rarity-multiplier terrain-multiplier) u10000),
      tokens: (/ (* (get base-tokens base-rates) rarity-multiplier terrain-multiplier) u10000)
    }))

(define-private (has-sufficient-resources (player principal) (required {wood: uint, stone: uint, metal: uint, energy: uint}))
  (let ((player-res (default-to {wood: u0, stone: u0, metal: u0, energy: u0, last-updated: u0} 
                                (map-get? player-resources player))))
    (and (>= (get wood player-res) (get wood required))
         (>= (get stone player-res) (get stone required))
         (>= (get metal player-res) (get metal required))
         (>= (get energy player-res) (get energy required)))))

(define-private (deduct-resources (player principal) (cost {wood: uint, stone: uint, metal: uint, energy: uint}))
  (let ((current-res (default-to {wood: u0, stone: u0, metal: u0, energy: u0, last-updated: u0} 
                                 (map-get? player-resources player))))
    (map-set player-resources player {
      wood: (- (get wood current-res) (get wood cost)),
      stone: (- (get stone current-res) (get stone cost)),
      metal: (- (get metal current-res) (get metal cost)),
      energy: (- (get energy current-res) (get energy cost)),
      last-updated: block-height
    })))

;; Public functions

;; Construct building on land using blueprint
(define-public (construct-building (land-id uint) (blueprint-id uint))
  (let ((land-owner-result (get-land-owner land-id))
        (blueprint-owner-result (get-blueprint-owner blueprint-id))
        (land-data-result (get-land-data land-id))
        (blueprint-data-result (get-blueprint-data blueprint-id))
        (building-id (next-building-id)))
    
    ;; Verify land exists and caller owns it
    (let ((land-owner (unwrap! land-owner-result err-land-not-found)))
      (asserts! (is-eq (some tx-sender) land-owner) err-not-land-owner))
    
    ;; Verify blueprint exists and caller owns it
    (let ((blueprint-owner (unwrap! blueprint-owner-result err-blueprint-not-found)))
      (asserts! (is-eq (some tx-sender) blueprint-owner) err-not-blueprint-owner))
    
    ;; Check if land already has a building
    (asserts! (is-none (map-get? land-buildings land-id)) err-building-limit-exceeded)
    
    ;; Get land and blueprint data
    (let ((land-data (unwrap! land-data-result err-land-not-found))
          (blueprint-data (unwrap! blueprint-data-result err-blueprint-not-found)))
      
      ;; Calculate construction cost and verify resources
      (let ((construction-cost (calculate-construction-cost blueprint-data)))
        (asserts! (has-sufficient-resources tx-sender construction-cost) err-insufficient-resources)
        
        ;; Deduct construction resources
        (deduct-resources tx-sender construction-cost)
        
        ;; Calculate production rates based on blueprint and terrain
        (let ((terrain-multiplier (get resource-multiplier land-data))
              (production-rates (calculate-production-rates 
                                (get building-type blueprint-data)
                                (get rarity blueprint-data)
                                terrain-multiplier)))
          
          ;; Create building record
          (map-set buildings building-id {
            land-id: land-id,
            blueprint-id: blueprint-id,
            owner: tx-sender,
            building-type: (get building-type blueprint-data),
            built-at: block-height,
            last-harvest: block-height,
            level: u1,
            status: "under-construction",
            daily-production: production-rates
          })
          
          ;; Map land to building
          (map-set land-buildings land-id building-id)
          
          ;; Burn the blueprint NFT (consumed in construction)
          (try! (contract-call? .blueprint-nft transfer blueprint-id tx-sender contract-owner))
          
          (ok building-id))))))

;; Complete construction (called after construction time has passed)
(define-public (complete-construction (building-id uint))
  (let ((building (unwrap! (map-get? buildings building-id) err-building-not-found)))
    (asserts! (is-eq tx-sender (get owner building)) err-not-authorized)
    (asserts! (is-eq (get status building) "under-construction") err-building-under-construction)
    (asserts! (>= block-height (+ (get built-at building) (var-get construction-time-blocks))) err-building-under-construction)
    
    ;; Mark building as active
    (map-set buildings building-id (merge building {status: "active"}))
    
    (ok true)))

;; Collect generated resources from building
(define-public (collect-resources (building-id uint))
  (let ((building (unwrap! (map-get? buildings building-id) err-building-not-found)))
    (asserts! (is-eq tx-sender (get owner building)) err-not-authorized)
    (asserts! (is-eq (get status building) "active") err-building-under-construction)
    
    ;; Calculate time since last harvest
    (let ((blocks-since-harvest (- block-height (get last-harvest building)))
          (generation-periods (/ blocks-since-harvest (var-get resource-generation-interval))))
      
      (asserts! (> generation-periods u0) err-no-resources-to-collect)
      
      ;; Calculate generated resources
      (let ((production (get daily-production building))
            (generated-wood (* (get wood production) generation-periods))
            (generated-stone (* (get stone production) generation-periods))
            (generated-metal (* (get metal production) generation-periods))
            (generated-energy (* (get energy production) generation-periods))
            (generated-tokens (* (get tokens production) generation-periods)))
        
        ;; Update player resources
        (let ((current-res (default-to {wood: u0, stone: u0, metal: u0, energy: u0, last-updated: u0} 
                                       (map-get? player-resources tx-sender))))
          (map-set player-resources tx-sender {
            wood: (+ (get wood current-res) generated-wood),
            stone: (+ (get stone current-res) generated-stone),
            metal: (+ (get metal current-res) generated-metal),
            energy: (+ (get energy current-res) generated-energy),
            last-updated: block-height
          }))
        
        ;; Update building last harvest time
        (map-set buildings building-id (merge building {last-harvest: block-height}))
        
        ;; Mint platform tokens as P2E rewards
        (if (> generated-tokens u0)
          (try! (contract-call? .platform-token mint generated-tokens tx-sender))
          true)
        
        (ok {
          wood: generated-wood,
          stone: generated-stone,
          metal: generated-metal,
          energy: generated-energy,
          tokens: generated-tokens
        })))))

;; Read-only functions

(define-read-only (get-building-info (building-id uint))
  (map-get? buildings building-id))

(define-read-only (get-building-by-land (land-id uint))
  (match (map-get? land-buildings land-id)
    some-building-id (map-get? buildings some-building-id)
    none))

(define-read-only (get-player-resources (player principal))
  (map-get? player-resources player))

(define-read-only (calculate-pending-resources (building-id uint))
  (match (map-get? buildings building-id)
    some-building (let ((blocks-since-harvest (- block-height (get last-harvest some-building)))
                        (generation-periods (/ blocks-since-harvest (var-get resource-generation-interval)))
                        (production (get daily-production some-building)))
                    (some {
                      wood: (* (get wood production) generation-periods),
                      stone: (* (get stone production) generation-periods),
                      metal: (* (get metal production) generation-periods),
                      energy: (* (get energy production) generation-periods),
                      tokens: (* (get tokens production) generation-periods),
                      periods: generation-periods
                    }))
    none))

(define-read-only (get-last-building-id)
  (var-get last-building-id))

;; Admin functions

(define-public (set-construction-time (new-time uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set construction-time-blocks new-time)
    (ok true)))

(define-public (set-generation-interval (new-interval uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set resource-generation-interval new-interval)
    (ok true)))

;; Emergency function to add resources to player (for testing/admin)
(define-public (admin-add-resources (player principal) (resources {wood: uint, stone: uint, metal: uint, energy: uint}))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (let ((current-res (default-to {wood: u0, stone: u0, metal: u0, energy: u0, last-updated: u0} 
                                   (map-get? player-resources player))))
      (map-set player-resources player {
        wood: (+ (get wood current-res) (get wood resources)),
        stone: (+ (get stone current-res) (get stone resources)),
        metal: (+ (get metal current-res) (get metal resources)),
        energy: (+ (get energy current-res) (get energy resources)),
        last-updated: block-height
      }))
    (ok true)))
