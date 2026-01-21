# Spec: M004-S001: Match-5 Power-Up Creation

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Add a power-up created from a 5-in-a-row match.

## Goals
- Detect 5-in-a-row matches
- Spawn a color-clear power-up tile

## Non-Goals
- Power-up activation
- Cross/branch power-ups

## Functional Requirements
- 5-match produces a distinct power-up tile
- Power-up type: Color Clear (clears all tiles of a letter)

## Non-Functional Requirements
- Power-up creation does not break cascades

## UX Notes
- Stronger visual marker than match-4 power-up

## Data / State
- Tile type includes power-up flag

## Decisions
- Spawn location: if created by a swap, place on the swap destination tile
- If created by cascade (no swap origin), place on the center-most tile of the match
- For even-length matches, choose the center-most tile that is lower/right in grid order

## Definition of Done (DoD)
- 5-match creates power-up tile

## Out of Scope
- Activation rules

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
