# Spec: M005-S005: Tile Readability (Size/Spacing) Pass

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Tile size and spacing may be too tight for quick recognition on small screens.

## Goals

- Improve tile readability with minor size/spacing adjustments
- Preserve the board's overall footprint and balance

## Non-Goals

- Changing board dimensions or grid size
- New tile art or animations

## Functional Requirements

- Tile size and gap can be adjusted via config
- Gap still matches board padding (XDR-005)
- Board remains within the baseline pixel size (300 to 320px)

## Non-Functional Requirements

- No layout instability during swaps or cascades

## UX Notes

- Test at least two size/gap combinations for clarity
- Ensure power-up tiers remain visually distinct after adjustments

## Data / State

- Tile size and gap configuration

## Decisions

- Select one size/gap combination and capture in an XDR
- Update `docs/ideas/I001/design-baseline.md` once a direction is chosen

## Definition of Done (DoD)

- A preferred tile size/gap is selected after quick playtest
- Config controls the chosen size/gap

## Out of Scope

- Full layout redesign

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
