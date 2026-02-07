# Spec: I002-M006-S002: Match-4/5 Power-Up Creation Rules

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Match-4 and match-5 should create power-up tiles to reward the player.

## Goals

- Spawn line-clear power-up on match-4
- Spawn color-clear power-up on match-5

## Non-Goals

- Combined power-up effects (handled in S004)

## Functional Requirements

- Match-4 creates a line-clear power-up tile at a chosen cell in the run
- Match-5 creates a color-clear power-up tile at a chosen cell in the run
- Power-up tile inherits the base color (typeId) of the match

## Non-Functional Requirements

- Deterministic spawn cell selection

## UX Notes

- Prefer spawning at the swap destination when possible

## Notes

- Assumption: Power-up creation follows I001 logic for selecting a spawn cell.

## Definition of Done (DoD)

- Power-ups spawn on match-4/5 consistently

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
