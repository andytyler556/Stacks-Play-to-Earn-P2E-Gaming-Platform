;; Access Control Contract with Tiered Permission System
;; Manages user roles, permissions, and verification with granular access control

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-user-not-found (err u102))
(define-constant err-invalid-role (err u103))
(define-constant err-already-registered (err u104))
(define-constant err-verification-pending (err u105))
(define-constant err-verification-not-found (err u106))
(define-constant err-invalid-permission (err u107))

;; Role constants
(define-constant ROLE-ADMIN u1)
(define-constant ROLE-MODERATOR u2)
(define-constant ROLE-PROVIDER u3)
(define-constant ROLE-CONSUMER u4)

;; Permission constants
(define-constant PERM-MANAGE-USERS u1)
(define-constant PERM-VERIFY-USERS u2)
(define-constant PERM-UPLOAD-DATASETS u3)
(define-constant PERM-MODERATE-CONTENT u4)
(define-constant PERM-PURCHASE-DATASETS u5)
(define-constant PERM-VIEW-ANALYTICS u6)
(define-constant PERM-MANAGE-CONTRACTS u7)

;; Data variables
(define-data-var last-verification-id uint u0)

;; User data structure
(define-map users principal {
  role: uint,
  verified: bool,
  reputation-score: uint,
  registration-date: uint,
  last-activity: uint,
  verification-documents: (optional (string-utf8 256)),
  banned: bool,
  ban-reason: (optional (string-utf8 256))
})

;; Role permissions mapping
(define-map role-permissions uint (list 10 uint))

;; Verification requests
(define-map verification-requests uint {
  user: principal,
  requested-role: uint,
  documents-uri: (string-utf8 256),
  status: (string-ascii 10), ;; "pending", "approved", "rejected"
  submitted-at: uint,
  reviewed-by: (optional principal),
  reviewed-at: (optional uint),
  notes: (optional (string-utf8 256))
})

;; User activity tracking
(define-map user-activity principal {
  datasets-uploaded: uint,
  datasets-purchased: uint,
  total-earnings: uint,
  total-spent: uint,
  last-login: uint
})

;; Initialize role permissions
(map-set role-permissions ROLE-ADMIN (list PERM-MANAGE-USERS PERM-VERIFY-USERS PERM-UPLOAD-DATASETS PERM-MODERATE-CONTENT PERM-PURCHASE-DATASETS PERM-VIEW-ANALYTICS PERM-MANAGE-CONTRACTS))
(map-set role-permissions ROLE-MODERATOR (list PERM-VERIFY-USERS PERM-MODERATE-CONTENT PERM-PURCHASE-DATASETS PERM-VIEW-ANALYTICS))
(map-set role-permissions ROLE-PROVIDER (list PERM-UPLOAD-DATASETS PERM-PURCHASE-DATASETS PERM-VIEW-ANALYTICS))
(map-set role-permissions ROLE-CONSUMER (list PERM-PURCHASE-DATASETS))

;; Helper functions

(define-private (next-verification-id)
  (begin
    (var-set last-verification-id (+ (var-get last-verification-id) u1))
    (var-get last-verification-id)))

(define-private (is-valid-role (role uint))
  (and (>= role ROLE-ADMIN) (<= role ROLE-CONSUMER)))

(define-private (has-permission (user principal) (permission uint))
  (match (map-get? users user)
    user-data (let ((user-role (get role user-data))
                   (user-permissions (default-to (list) (map-get? role-permissions user-role))))
      (and (get verified user-data)
           (not (get banned user-data))
           (is-some (index-of user-permissions permission))))
    false))

;; Public functions

;; User registration
(define-public (register-user)
  (begin
    (asserts! (is-none (map-get? users tx-sender)) err-already-registered)
    
    ;; Register user with consumer role by default
    (map-set users tx-sender {
      role: ROLE-CONSUMER,
      verified: true, ;; Auto-verify consumers
      reputation-score: u100,
      registration-date: block-height,
      last-activity: block-height,
      verification-documents: none,
      banned: false,
      ban-reason: none
    })
    
    ;; Initialize activity tracking
    (map-set user-activity tx-sender {
      datasets-uploaded: u0,
      datasets-purchased: u0,
      total-earnings: u0,
      total-spent: u0,
      last-login: block-height
    })
    
    (ok true)))

;; Request role upgrade with verification
(define-public (request-verification (requested-role uint) (documents-uri (string-utf8 256)))
  (let ((verification-id (next-verification-id))
        (user (unwrap! (map-get? users tx-sender) err-user-not-found)))
    
    (asserts! (is-valid-role requested-role) err-invalid-role)
    (asserts! (> requested-role (get role user)) err-invalid-role) ;; Can only upgrade role
    
    ;; Create verification request
    (map-set verification-requests verification-id {
      user: tx-sender,
      requested-role: requested-role,
      documents-uri: documents-uri,
      status: "pending",
      submitted-at: block-height,
      reviewed-by: none,
      reviewed-at: none,
      notes: none
    })
    
    (ok verification-id)))

;; Verify user (admin/moderator only)
(define-public (verify-user (verification-id uint) (approved bool) (notes (optional (string-utf8 256))))
  (let ((request (unwrap! (map-get? verification-requests verification-id) err-verification-not-found))
        (user-data (unwrap! (map-get? users (get user request)) err-user-not-found)))
    
    (asserts! (has-permission tx-sender PERM-VERIFY-USERS) err-not-authorized)
    (asserts! (is-eq (get status request) "pending") err-verification-pending)
    
    (if approved
      (begin
        ;; Approve verification - upgrade user role
        (map-set users (get user request) (merge user-data {
          role: (get requested-role request),
          verified: true,
          verification-documents: (some (get documents-uri request))
        }))
        
        ;; Update verification request
        (map-set verification-requests verification-id (merge request {
          status: "approved",
          reviewed-by: (some tx-sender),
          reviewed-at: (some block-height),
          notes: notes
        })))
      (begin
        ;; Reject verification
        (map-set verification-requests verification-id (merge request {
          status: "rejected",
          reviewed-by: (some tx-sender),
          reviewed-at: (some block-height),
          notes: notes
        }))))
    
    (ok approved)))

;; Ban user (admin only)
(define-public (ban-user (user principal) (reason (string-utf8 256)))
  (let ((user-data (unwrap! (map-get? users user) err-user-not-found)))
    (asserts! (has-permission tx-sender PERM-MANAGE-USERS) err-not-authorized)
    
    (map-set users user (merge user-data {
      banned: true,
      ban-reason: (some reason)
    }))
    
    (ok true)))

;; Unban user (admin only)
(define-public (unban-user (user principal))
  (let ((user-data (unwrap! (map-get? users user) err-user-not-found)))
    (asserts! (has-permission tx-sender PERM-MANAGE-USERS) err-not-authorized)
    
    (map-set users user (merge user-data {
      banned: false,
      ban-reason: none
    }))
    
    (ok true)))

;; Update user activity
(define-public (update-user-activity (user principal) (activity-type (string-ascii 20)) (amount uint))
  (let ((activity (default-to {datasets-uploaded: u0, datasets-purchased: u0, total-earnings: u0, total-spent: u0, last-login: block-height} 
                              (map-get? user-activity user))))
    
    ;; This function should be called by authorized contracts only
    ;; For now, we'll allow any caller but in production this should be restricted
    
    (if (is-eq activity-type "upload")
      (map-set user-activity user (merge activity {
        datasets-uploaded: (+ (get datasets-uploaded activity) u1),
        last-login: block-height
      }))
      (if (is-eq activity-type "purchase")
        (map-set user-activity user (merge activity {
          datasets-purchased: (+ (get datasets-purchased activity) u1),
          total-spent: (+ (get total-spent activity) amount),
          last-login: block-height
        }))
        (if (is-eq activity-type "earning")
          (map-set user-activity user (merge activity {
            total-earnings: (+ (get total-earnings activity) amount),
            last-login: block-height
          }))
          (map-set user-activity user (merge activity {
            last-login: block-height
          })))))
    
    (ok true)))

;; Permission checking functions

(define-public (check-permission (user principal) (permission uint))
  (ok (has-permission user permission)))

(define-public (can-upload-datasets (user principal))
  (ok (has-permission user PERM-UPLOAD-DATASETS)))

(define-public (can-purchase-datasets (user principal))
  (ok (has-permission user PERM-PURCHASE-DATASETS)))

(define-public (can-moderate-content (user principal))
  (ok (has-permission user PERM-MODERATE-CONTENT)))

(define-public (can-verify-users (user principal))
  (ok (has-permission user PERM-VERIFY-USERS)))

;; Read-only functions

(define-read-only (get-user (user principal))
  (map-get? users user))

(define-read-only (get-user-role (user principal))
  (match (map-get? users user)
    user-data (some (get role user-data))
    none))

(define-read-only (get-user-activity (user principal))
  (map-get? user-activity user))

(define-read-only (get-verification-request (verification-id uint))
  (map-get? verification-requests verification-id))

(define-read-only (get-role-permissions (role uint))
  (map-get? role-permissions role))

(define-read-only (is-user-verified (user principal))
  (match (map-get? users user)
    user-data (and (get verified user-data) (not (get banned user-data)))
    false))

(define-read-only (is-user-banned (user principal))
  (match (map-get? users user)
    user-data (get banned user-data)
    false))
