# Spec: I002-M006-S004: Power-Up Combo -> Mega Power-Up

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Matching power-ups together should create a larger reward moment.

## Goals

- Detect matches that include two or more power-up tiles
- Spawn a mega power-up tile as a reward

## Non-Goals

- Complex chain reactions beyond the mega power-up

## Functional Requirements

- If a match includes 2+ power-up tiles, create a mega power-up tile
- Mega power-up retains a base color (typeId) for matching
- Mega power-up activation clears the entire board (or a large area)

## Non-Functional Requirements

- Deterministic spawn location (prefer swap destination)

## UX Notes

- Mega power-up should be visually distinct

## Notes

- Assumption: Mega power-up clears the entire board for a strong reward beat.

## Definition of Done (DoD)

- Power-up combos reliably create a mega power-up

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
