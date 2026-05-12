# Security Specification - Paraíso One

## Data Invariants
- A Service Order (OS) must have a valid `clientId` and `techId`.
- Only Admins can create or delete Users and Clients.
- Technicians can only see OS assigned to them.
- Technicians can only update specific fields in an OS (status, checklist, photos, signature, times).
- Timestamps (`createdAt`, `updatedAt`) must be server-generated.
- Location data must be associated with the authenticated user ID.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Technician trying to update an OS assigned to another technician.
2. **Privilege Escalation**: Technician trying to set their own `role` to 'admin'.
3. **Ghost Field Injection**: Adding `isApproved: true` to a Client document.
4. **Orphaned OS**: Creating an OS without a `clientId`.
5. **State Skipping**: Moving an OS directly from 'pending' to 'finished' without 'arrived' (optional, but good for validation).
6. **ID Poisoning**: Using a 1MB string as a document ID for a new user.
7. **Resource Exhaustion**: Sending a 10MB string in the `description` field.
8. **PII Leak**: Non-admin user trying to list all users' phone numbers.
9. **Timestamp Fraud**: Client providing a manual `createdAt` date in the past.
10. **Admin Bypass**: Trying to write to the `admins/` collection.
11. **Signature Forgery**: Updating another user's signature field in an OS.
12. **Location Spoofing**: Writing a location log for a different `uid`.

## Test Runner Plan
- [ ] Test that `users/{uid}` can only be created by Admins or the user itself (during first registration).
- [ ] Test that `admins/{uid}` is write-protected.
- [ ] Test that `service_orders` updates are restricted by `affectedKeys().hasOnly()`.
- [ ] Test that `list` queries are filtered by `techId` for technicians.
