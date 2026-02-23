# Specification

## Summary
**Goal:** Replace the leaderboard placeholder with a fully functional lifetime stats system featuring King Pooper and King Wiper rankings, MVP badges, and an all-time standings table.

**Planned changes:**
- Remove existing leaderboard placeholder and implement complete lifetime leaderboard with King Pooper (most poops) and King Wiper (most wipes) rankings
- Add MVP badge for any user holding both King Pooper and King Wiper titles simultaneously
- Calculate and display toilet paper roll consumption for each user (total wipes × sheets per wipe ÷ sheets per roll)
- Calculate and display average wipes per poop efficiency metric for each user (total wipes ÷ total poops)
- Create all-time standings table showing all users ranked by total poops (primary) and total wipes (secondary)
- Display columns for display name/emoji, total poops, total wipes, TP rolls used, and average wipes per poop
- Add backend query function to aggregate and return all users' lifetime statistics
- Show crown and toilet paper badges next to leaders in the standings table
- Update rankings in real-time when new poop entries are logged

**User-visible outcome:** Users can view a comprehensive leaderboard showing King Pooper and King Wiper titles with badges, an MVP badge for dual title holders, and a full standings table with everyone's lifetime stats including total poops, total wipes, toilet paper rolls consumed, and average wipes per poop efficiency metric.
