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
- Power-up + power-up swap triggers a combined effect (no chaining)

## Non-Functional Requirements
- Activation integrates with cascades

## UX Notes
- Visual feedback on activation

## Data / State
- Power-up type enum

## Decisions
- Activation: only via swap (no tap-to-activate)
- Resolution order: clear effect -> cascades -> repeat match resolution until steady state
- Steady state: no new matches or cascades for 1 second
- Combined effects on power-up swap:
  - Line Clear + Line Clear: clear both the swap row and column (cross)
  - Line Clear + Color Clear: clear swap row and column, then clear all tiles of the swapped color
  - Color Clear + Color Clear: clear all tiles on the board

## Definition of Done (DoD)
- Power-ups activate and clear tiles

## Out of Scope
- Loot-based activation

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
