# Spec: M006-S001: Activate Line Clear Power-Up

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Enable activation of line clear power-ups created in earlier slices.

## Goals
- Trigger line clear on swap activation

## Non-Goals
- Power-up chains

## Functional Requirements
- Power-up triggers on swap
- Clear row or column based on power-up orientation

## Non-Functional Requirements
- Activation integrates with cascades

## UX Notes
- Visual feedback on activation

## Data / State
- Power-up type enum

## Decisions
- Activation only via swap (no tap)

## Definition of Done (DoD)
- Line clear power-ups activate and clear tiles

## Out of Scope
- Combined power-up effects

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
