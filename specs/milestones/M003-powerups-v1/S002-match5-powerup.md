# Spec: M003-S002: Match-5 Power-Up

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Add a power-up created from a 5-in-a-row match.

## Goals
- Detect 5-in-a-row matches
- Spawn a more powerful tile

## Non-Goals
- Cross/branch power-ups (later)

## Functional Requirements
- 5-match produces a distinct power-up tile

## Non-Functional Requirements
- Power-up creation does not break cascades

## UX Notes
- Stronger visual marker than match-4 power-up

## Data / State
- Tile type includes power-up flag

## Open Questions
- Power-up effect (clear all of a letter? area?) TBD

## Definition of Done (DoD)
- 5-match creates power-up tile

## Out of Scope
- Activation rules

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
