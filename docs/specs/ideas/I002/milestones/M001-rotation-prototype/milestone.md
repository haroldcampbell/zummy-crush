# Milestone: I002-M001 - Core Rotation Prototype

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Goal

Deliver a playable rotation-input prototype where a player can rotate a row or column and see tiles snap into place.

## Scope (In)

- Drag a single row or column per move
- Wrap rotation within the dragged line only
- Snap-to-grid after release
- Basic input feedback (selected row/column highlight)

## Scope (Out)

- Match resolution
- Gravity/cascades
- Power-ups or loot

## Success Criteria

- Player can rotate any row or column and see the line wrap correctly
- A move completes only after release and snap

## Specs

- [ ] S001 - Row/Column Rotation Input
- [ ] S002 - Line Wrap + Snap Behavior
- [ ] S003 - Input Feedback and Constraints

## Dependencies

- None

## Risks

- Rotation input may feel imprecise on mobile
