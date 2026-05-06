# Security Specification - GORENG (Gerakan Orang Peduli Lingkungan)

## 1. Data Invariants
- A `Deposit` must have a valid `user_id` and `rt_id`.
- The `weight_kg` must be > 0 and capped at 20kg (as per PRD).
- `Points` are calculated based on category multipliers.
- Only the user who created a `Deposit` or an admin can read it, unless it's for leaderboard aggregations.
- `RT` and `RW` data are public for leaderboards.
- `ViolationReport` is visible to the reporter and the targeted `rt_leader`.

## 2. The Dirty Dozen (Threat Models)
1. **Identity Spoofing**: Citizen A submits a deposit as Citizen B.
2. **Weight Poisoning**: Citizen submits 1000kg to cheat.
3. **Role Escalation**: Citizen tries to update their role to `lurah` in their profile.
4. **Point Injection**: Citizen manually sets `points: 10000` in the deposit request.
5. **Session Hijacking**: Attacker tries to delete someone else's deposit.
6. **Cross-RT Sabotage**: RT Leader of RT 01 tries to delete reports for RT 02.
7. **Timestamp Fraud**: Citizen sets `created_at` in the past to gain points for a previous season.
8. **Shadow Fields**: Attacker adds `isAdmin: true` to their user document.
9. **Spamming Reports**: Attacker submits 100 violation reports in a minute.
10. **ID Poisoning**: Using a 1MB string as a document ID.
11. **PII Leak**: Non-admin user tries to list all user emails.
12. **State Shortcutting**: Sponsor tries to mark a reward as `claimed` without paying.

## 3. Test Runner Plan
The rules will:
- Check `request.auth.uid == userId` for user profiles.
- Validate `incoming().weight_kg <= 20`.
- Forbid setting `role` on update if not an admin (initial creation allows it for onboarding).
- Use `request.time` for `created_at`.
- Restrict `points` field updates.
