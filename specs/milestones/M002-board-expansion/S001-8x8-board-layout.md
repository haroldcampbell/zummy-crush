# Spec: M002-S001: 8x8 Board Layout

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Scale the board from 3x3 to 8x8 while keeping the board responsive and readable on mobile.

## Goals

- Render an 8x8 board
- Preserve drag-to-swap interaction
- Maintain clear legibility of tiles

## Non-Goals

- Voids or irregular shapes (handled in S002)
- Loadable boards (handled in S003)

## Functional Requirements

- Board renders 8x8 tiles
- Swap and match logic works at 8x8
- Remove the timer from the board
- Animations happen a bit slower so that user can see them
- Improve game score readability (add 000s comma)

## Non-Functional Requirements

- Must fit in mobile viewport without horizontal scrolling

## UX Notes

- Reference `docs/design-baseline.md` for tile sizing and spacing

## Data / State

- Grid size becomes configurable

## Open Questions

- TBD: target tile size and spacing for readability

## Definition of Done (DoD)

- 8x8 board renders and is playable
- No layout overflow on target mobile viewports

## Out of Scope

- Board masks

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Timer removed
- [ ] Animation speed reduced
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
