# Hand-off: I002 Session Summary

## Summary

- Implemented scoring HUD and scoring rules; updated tile IDs to shape-based names.
- Added match-4/5 power-ups with activation rules and mega combo; power-ups are color-specific and activate only when matched.
- Added help/Info modal explaining scoring values; exportable state via URL when enabled.
- Animation polish: gravity-based cascades, tap feedback, repulsion; drag friction removed due to artifacts.

## Current Status

- Branches in progress: `feature/I002-M006-powerups`, `feature/I002-M004-animation-polish`.
- Power-up visuals now use distinct shapes/colors via config.
- Tile set standardized to runes only.

## Open Questions

- Should power-ups activate on swap (not just by matching type)?
- Should matching be by shape only (ignore color) to reduce confusion?
- Should we add a match preview/debug overlay to clarify matches?

## Known Behaviors

- Power-ups only activate when part of a same-type match.
- Board state dump showed no 3+ runs; no resolution expected.

## Next Steps

- Decide whether to change power-up activation rules.
- Decide whether to alter matching rules or add clarity UX.
