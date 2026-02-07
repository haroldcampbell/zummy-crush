# Spec: I002-M003-S001: Thematic Base Tile Set (4 Types)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

I002 needs a thematic tile identity distinct from letters, while keeping readability high.

## Goals

- Replace letters with four thematic tile icons/shapes
- Preserve quick recognition and match planning

## Non-Goals

- Final art production

## Functional Requirements

- Tile rendering supports a non-letter icon set
- Exactly four base tile types are used for normal tiles
- Base tiles map consistently to match detection categories

## Non-Functional Requirements

- High contrast at 360 x 640

## UX Notes

- Choose icons with distinct silhouettes
- Avoid relying solely on color for differentiation

## Data / State

- Tile type enum (4 base types)

## Definition of Done (DoD)

- Four base tile types render correctly and are used in gameplay

## Out of Scope

- Animation or VFX

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
