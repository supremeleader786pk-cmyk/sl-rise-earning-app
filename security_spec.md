# Security Specification for Supreme Leader RISE

## 1. Data Invariants
- Each user profile (`/users/{userId}`) can only be read and updated by the authenticated owner (`request.auth.uid == userId`).
- Balance, totalEarnings, and todayEarnings can only be modified by the user according to valid task completion invariants.
- Users cannot change their `uid` or elevate their own role to `admin`.
- Withdrawals (`/users/{userId}/withdrawals/{withdrawalId}`) require:
  - Valid user ownership (`userId == request.auth.uid`).
  - Minimum amount >= 500 PKR.
  - Payment method restricted to Easypaisa, JazzCash, or Bank.
  - Initial status must be `pending`.
- Task logs (`/users/{userId}/taskLogs/{logId}`) can only be created by the authenticated owner for legitimate rewards.
- Referrals (`/users/{userId}/referrals/{refId}`) can only be read by the referrer.

## 2. Dirty Dozen Invariant Payloads
1. Attempt to overwrite another user's profile (`/users/otherUser`).
2. Attempt to create a withdrawal with negative amount (`amount: -500`).
3. Attempt to create a withdrawal with amount below minimum (`amount: 200`).
4. Attempt to create a withdrawal for another user's account (`userId != request.auth.uid`).
5. Attempt to set withdrawal status directly to `approved` on creation.
6. Attempt to inject a 100KB string into `accountTitle` or `accountNumber`.
7. Attempt to inject invalid payment methods (e.g. `method: "CryptoScam"`).
8. Attempt to spoof `uid` in `/users/{userId}` to impersonate an administrator.
9. Attempt unauthenticated read on `/users/{userId}`.
10. Attempt to delete withdrawal history by unauthorized third parties.
11. Attempt to inject arbitrary shadow fields outside allowed schema keys.
12. Attempt to tamper with referral commission rates without valid logs.
