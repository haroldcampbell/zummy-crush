# Spec: M003-S001: Match-4 Power-Up Creation

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Add a basic power-up that is created on a 4-in-a-row match.

## Goals
- Detect 4-in-a-row matches
- Spawn a power-up tile

## Non-Goals
- Power-up activation (handled in a later slice)

## Functional Requirements
- 4-match produces a distinct power-up tile
- Power-up type: Line Clear
- Line Clear orientation: horizontal match -> clear row, vertical match -> clear column

## Non-Functional Requirements
- Power-up creation does not break cascades

## UX Notes
- Visual difference from regular tiles

## Data / State
- Tile type includes power-up flag

## Decisions
- Spawn location: if created by a swap, place on the swap destination tile
- If created by cascade (no swap origin), place on the center-most tile of the match
- For even-length matches, choose the center-most tile that is lower/right in grid order

## Definition of Done (DoD)
- 4-match creates power-up tile

## Out of Scope
- Power-up activation or chained effects

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
