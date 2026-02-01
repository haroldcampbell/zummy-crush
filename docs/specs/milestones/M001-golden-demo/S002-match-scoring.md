# Spec: M001-S002: Match Detection + Scoring

## Problem Statement

Detect matches on the 3x3 board, remove matches, refill tiles, and update score using letter values.

## Goals

- Detect 3-in-a-row matches (horizontal/vertical)
- Clear matched tiles and refill randomly
- Update score using A=10^2, B=10^3, C=10^4, D=10^5, E=10^6

## Non-Goals

- Special branching match shapes (T- or L-shaped), power-ups, or combo bonuses
- Advanced refill animations

## Functional Requirements

- After a valid swap, detect matches
- If match exists, remove and refill tiles
- Update score and display current score

## Non-Functional Requirements

- Match detection handles all 3x3 cases
- Refill does not produce errors or empty tiles

## UX Notes

- Keep match resolution simple and readable
- Reference: `docs/design-baseline.md` for layout and visual defaults.

## Data / State

- Score state
- Match list

## Open Questions

  - Decision: allow basic cascades to increase points and joy.

## Definition of Done (DoD)

- Matches resolve correctly
- Score updates based on letters matched
- Refill occurs after match

## Decisions / Notes

- Basic cascades are enabled to maximize points/joy.
- Refill uses simple gravity without animations (advanced refill animations out of scope).
- Tests: no automated tests in M001 POC (no harness yet).

## Out of Scope

- Combo multipliers
- Power-ups

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [ ] Tests added/updated
- [x] Docs updated
