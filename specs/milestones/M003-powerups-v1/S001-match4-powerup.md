# Spec: M003-S001: Match-4 Power-Up

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Add a basic power-up that is created on a 4-in-a-row match.

## Goals
- Detect 4-in-a-row matches
- Spawn a power-up tile

## Non-Goals
- Complex activation patterns

## Functional Requirements
- 4-match produces a distinct power-up tile

## Non-Functional Requirements
- Power-up creation does not break cascades

## UX Notes
- Visual difference from regular tiles

## Data / State
- Tile type includes power-up flag

## Open Questions
- Power-up effect (clear row or column) TBD

## Definition of Done (DoD)
- 4-match creates power-up tile

## Out of Scope
- Power-up activation

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
