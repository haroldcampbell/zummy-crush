# Spec: I002-M010-S004: Tile Background + VFX Proximity Cues

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Tiles have a constant beige background that reduces contrast. The player wants backgrounds to appear only during drag and to add color cues near void/tornado effects.

## Goals

- Remove resting tile background fill
- Add a drag-only tile background color
- Add proximity color cues for void/tornado effects

## Non-Goals

- Replacing tile fill colors
- Complex shader effects

## Functional Requirements

- Resting tiles have no background fill (transparent over board panel)
- During drag/snapping, tiles use a configurable drag background color
- Tiles within a configurable radius of void/tornado pulses temporarily tint using tile colors
- Proximity cues are subtle and do not obscure tile shapes

## Non-Functional Requirements

- No noticeable performance impact on mobile

## UX Notes

- Effects should feel like a soft glow or flash rather than a full recolor

## Definition of Done (DoD)

- Resting background removed
- Drag background and proximity cues are visible and configurable

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
