# Spec: I002-M003-S002: Power-Up Variant Visuals

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Power-up variants should be visually distinct while still tied to their base tile type.

## Goals

- Define visual treatments for power-up variants of the four base tiles
- Ensure variants are distinguishable from base tiles

## Non-Goals

- Power-up behavior or activation rules

## Functional Requirements

- Each base tile type has a corresponding power-up visual variant
- Variants preserve the base icon but add a distinct treatment (frame, glow, badge)

## Non-Functional Requirements

- Variants remain readable at small tile sizes

## UX Notes

- Keep a consistent treatment across all variants for clarity

## Data / State

- Variant style config per base tile type

## Definition of Done (DoD)

- Power-up variants render and are visually distinct from base tiles

## Out of Scope

- Animation or sound

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
