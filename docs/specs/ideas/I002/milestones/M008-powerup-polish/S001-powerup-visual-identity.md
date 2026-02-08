# Spec: I002-M008-S001: Power-Up Visual Identity (Shape + Color Only)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Current power-up badges rely on text labels. The goal is to convey power-ups purely through shape and color.

## Goals

- Remove text badges for power-ups
- Use shape and color to indicate type
- Add a small cycling color dot for high-tier power-ups
- Add subtle rotation to signal special tiles

## Non-Goals

- Particle effects or VFX polish (M009)
- Changing match logic

## Functional Requirements

- Remove text icons/badges from power-up tiles
- Match-4 and Match-5 power-ups use distinct shapes
- White Square and Black Omni-Circle include a small center dot that cycles through colors
- Power-up matching is color-agnostic for White Square and Black Omni-Circle
- Rotation speed and dot cycling are configurable

## Non-Functional Requirements

- Maintain readability on mobile

## UX Notes

- Visual identity should be legible at small sizes

## Definition of Done (DoD)

- Power-ups are identifiable without text
- High-tier power-ups include a subtle cycling color cue

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated (not applicable)
- [x] Docs updated
