# Specification

## Summary
**Goal:** Fix profile detection and routing so that existing users are never incorrectly redirected to the ProfileSetup page after authentication.

**Planned changes:**
- Rewrite routing logic in `App.tsx` to defer all routing decisions until both the actor is fully initialized and the profile query has completed, using an explicit tri-state: `loading`, `has-profile`, and `no-profile`.
- Display a full-screen loading indicator while the actor is initializing or the profile query is in flight.
- Only navigate to `ProfileSetup` when the state is definitively `no-profile`.
- Rewrite the `useProfile` hook in `useQueries.ts` to stay in a loading/pending state while the actor is not yet ready, never fire the backend query if the actor is undefined, and only report "no profile" after the async call has fully completed with a definitive null/empty result.

**User-visible outcome:** Existing users are taken directly to the Dashboard after authentication without ever seeing the ProfileSetup page. New users without a profile are still correctly routed to ProfileSetup.
