# Specification

## Summary
**Goal:** Fix the startup profile detection so that existing users are correctly routed to the Dashboard instead of being stuck on the profile creation screen.

**Planned changes:**
- Rewrite the `useProfile` hook in `useQueries.ts` to only fire the backend `getProfile` call after the actor is confirmed non-null, staying in `isLoading: true` until the call fully resolves
- Rewrite the routing logic in `App.tsx` to show a full-screen loading spinner until both the actor is ready and the profile query has settled, then route to Dashboard if a profile exists or ProfileSetup if it does not
- Add a 10-second safety timeout in `App.tsx` so the app never stays stuck on the loading screen indefinitely, falling through to ProfileSetup if the timeout is reached
- Display a "Loading your profile…" message during the loading state

**User-visible outcome:** Users who already have a profile are taken directly to the Dashboard on startup without ever seeing the profile creation screen. New users are still correctly routed to ProfileSetup, and no one gets stuck on a loading screen indefinitely.
