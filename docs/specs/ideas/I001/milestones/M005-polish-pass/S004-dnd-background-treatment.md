# Spec: M005-S004: DnD Background Treatment

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

The current background is visually thin for a DnD-themed game, reducing atmosphere and theme clarity.

## Goals

- Add a DnD-styled background treatment that supports the board without hurting readability
- Explore at least two background directions (e.g., parchment + map textures, tavern table)

## Non-Goals

- Full environment art or animated backgrounds
- Additional HUD features

## Functional Requirements

- Background can be swapped via config for quick comparison
- Background treatment does not obscure tile contrast

## Non-Functional Requirements

- No significant performance or load-time regressions

## UX Notes

- Prefer subtle texture with clear value separation behind the board
- Keep the board as the focal plane

## Data / State

- Background variant setting

## Decisions

- Select one background direction and capture in an XDR
- Update `docs/ideas/I001/design-baseline.md` once a direction is chosen

## Definition of Done (DoD)

- Two background treatments are playable via config toggle
- A preferred background direction is selected

## Out of Scope

- Particle effects or audio ambience

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
