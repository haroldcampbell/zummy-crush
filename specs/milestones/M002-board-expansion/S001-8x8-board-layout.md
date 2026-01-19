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
- Remove the timer from the board (UI and underlying timer logic)
- Animations happen a bit slower so that user can see them
- Improve game score readability (add 000s comma)
- Grid size is configurable with a default of 8x8
- Animation timings are configurable via a local config JSON

## Non-Functional Requirements

- Must fit in mobile viewport without horizontal scrolling

## UX Notes

- Reference `docs/design-baseline.md` for tile sizing and spacing

## Data / State

- Grid size becomes configurable

## Decisions

- Target baseline viewport: 360x640 (see `docs/design-baseline.md`)
- Baseline board width: 300px (scales up to 320px on wider viewports)
- Baseline tile size: 34px with 4px gaps
- Animation defaults (configurable): swap 0.5s, cascade 0.5s, match resolve 0.8s
- Config location: `app/assets/config/gameplay.json`

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
