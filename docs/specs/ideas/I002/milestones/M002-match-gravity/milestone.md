# Milestone: I002-M002 - Match Resolution + Gravity

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Goal

Add classic match-3 resolution, clears, and gravity/refill after a rotation move.

## Scope (In)

- Match-3+ detection (straight lines only)
- Resolve matches after snap only
- Clear tiles and apply gravity
- Refill new tiles after cascades

## Scope (Out)

- Power-ups
- Loot

## Success Criteria

- Matches resolve after a rotation move completes
- Cascades continue until the board stabilizes

## Specs

- [ ] S001 - Post-Snap Match Detection
- [ ] S002 - Clear + Gravity + Refill
- [ ] S003 - Cascade Loop Control

## Dependencies

- I002-M001

## Risks

- Rotation moves may create large cascades if tile variety is low
