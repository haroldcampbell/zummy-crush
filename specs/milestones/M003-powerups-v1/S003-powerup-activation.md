# Spec: M003-S003: Power-Up Activation Rules

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Define how power-ups are activated and how they clear tiles.

## Goals
- Define activation trigger (swap with any tile)
- Implement simple clear effects

## Non-Goals
- Chain reactions between power-ups

## Functional Requirements
- Power-up triggers on swap
- Effect clears tiles according to power-up type

## Non-Functional Requirements
- Activation integrates with cascades

## UX Notes
- Visual feedback on activation

## Data / State
- Power-up type enum

## Open Questions
- Final effects TBD in design review

## Definition of Done (DoD)
- Power-ups activate and clear tiles

## Out of Scope
- Loot-based activation

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
