# Spec: I002-M005-S001: HUD Score Display

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Playtests need visible feedback for match value; the HUD has no score readout.

## Goals

- Display current score in the HUD
- Keep the display readable on mobile

## Non-Goals

- Combo or multiplier UI

## Functional Requirements

- Score value is visible during play
- Score resets on new game

## Non-Functional Requirements

- No layout shifts during cascades

## UX Notes

- Use a single prominent value with a small label

## Notes

- Assumption: HUD style follows I001 hierarchy (label + value).

## Definition of Done (DoD)

- Score displays and updates correctly

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
