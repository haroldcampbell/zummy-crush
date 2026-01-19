# Milestone: M001 - Golden Demo

## Goal

Deliver a 60–120 second playable session that demonstrates the core loop: swap → match → score → refill, with a simple blitz timer and clear feedback.

## Scope (In)

- 3x3 board
- Tile swap with swap-back on invalid match
- Match detection + basic refill
- Scoring display for A–E tiles
- Simple blitz timer (30–120 seconds configurable)
- Minimal HUD (score, time, reset)

## Scope (Out)

- Power-ups, loot, progression
- Sound, music, haptics
- Backend services, persistence (including local), accounts
- Board editors, irregular boards, voids
- Accessibility/localization work beyond basic readability

## Success Criteria

- Playable session lasts 60–120 seconds
- Swaps feel responsive; invalid swaps visibly revert
- Matches resolve correctly and update score
- Timer ends session cleanly

## Specs

- [ ] S001 - Core Board + Input
- [ ] S002 - Match Detection + Scoring
- [ ] S003 - Blitz Session + HUD

## Dependencies

- None

## Risks

- Match logic edge cases could stall the board
- Scoring curve may feel flat without tuning

## Notes

- This milestone is intentionally minimal and browser-only.
