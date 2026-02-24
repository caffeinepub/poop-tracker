# Specification

## Summary
**Goal:** Rebuild the Poop Tracker app from scratch with only the core features: login, profile setup, poop/wipe logging, and a unified dashboard with a Lifetime/Daily toggle.

**Planned changes:**
- Rewrite the Motoko backend from scratch with clean, minimal functions: `registerProfile`, `getProfile`, `logPoop`, `getRankedStats`, and `getDailyStats`; remove all unused functions
- Rewrite `App.tsx` with simple two-phase routing: show a loading spinner until both the actor is initialized and the profile query resolves, then route to LoginPage, ProfileSetup, or Dashboard accordingly
- Rewrite the `useProfile` hook so the backend call only fires when the actor is non-null and `isLoading` remains true until the call fully resolves
- Rewrite `Dashboard.tsx` as a single unified page with a Lifetime/Daily toggle, a personal stats card, a leaderboard/standings table (ranked by poops and wipes), King Pooper and King Wiper badges (MVP if same user holds both), and a Log a Poop button; remove all Efficient Wiper references
- Keep `ProfileSetup.tsx` intact with display name, emoji, color, and background selection, live preview, and mobile emoji centering fix
- Keep `LogPoop.tsx` intact as a multi-step flow for logging poops and wipe count with a success screen
- Keep `LoginPage.tsx` intact with Internet Identity login and playful branding

**User-visible outcome:** Users can log in with Internet Identity, set up a profile, log poops with wipe counts, and view a single dashboard that toggles between lifetime and daily stats with a ranked leaderboard and achievement badges.
