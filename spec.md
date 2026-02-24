# Specification

## Summary
**Goal:** Revert the Poop Tracker frontend to the last known working state before the Efficient Wiper badge changes were introduced, fixing the app getting stuck on the loading screen.

**Planned changes:**
- Revert `App.tsx` to remove the tri-state (`loading`/`has-profile`/`no-profile`) routing pattern and restore simple, direct profile detection and routing logic
- Revert `useQueries.ts` to remove the guarded actor-initialization checks added in the broken versions, restoring the original profile-fetching logic
- Revert `Leaderboard.tsx` to show only King Pooper, King Wiper, and MVP badges — removing all Efficient Wiper badge logic while keeping the lifetime/daily toggle intact
- Revert `AllTimeStandings.tsx` to remove any Efficient Wiper highlighting from the standings tables while retaining all required columns (display name/emoji, total poops, total wipes, TP rolls, avg wipes per poop) and the lifetime/daily toggle

**User-visible outcome:** Users can authenticate with Internet Identity and reach the dashboard without the app hanging on the loading screen. The leaderboard shows only the original three badges and standings table with no Efficient Wiper references.
