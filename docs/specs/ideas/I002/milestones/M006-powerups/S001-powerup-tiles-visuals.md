# Spec: I002-M006-S001: Power-Up Tile Types + Visual Markers

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Power-up tiles must be recognizable and still tied to their base color.

## Goals

- Define power-up types (line-clear, color-clear, mega)
- Keep power-ups color-specific and readable

## Non-Goals

- New art pipeline

## Functional Requirements

- Power-up tiles carry a `powerUp` type and base `typeId`
- Visual markers distinguish power-ups from normal tiles

## Non-Functional Requirements

- Visuals remain readable at 360 x 640

## UX Notes

- Use a consistent badge or frame across power-up tiers

## Notes

- Assumption: Visual markers reuse the existing variant frame + badge system.
- Assumption: Power-ups use distinct shapes/colors via config to stand apart from base tiles.

## Definition of Done (DoD)

- Power-up tiles are visually distinct and color-specific

## Acceptance Checklist

- [ ] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
