# Spec: I002-M007-S002: Mobile Board Centering + Safe-Area Padding

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

On mobile, the game board is not centered and can feel visually off-balance.

## Goals

- Center the board on mobile in a CandyCrush/Bejeweled-style layout
- Respect safe-area insets (notches, home indicator)

## Non-Goals

- Desktop layout redesign
- New visual themes

## Functional Requirements

- Board is centered horizontally on mobile
- Board is visually centered vertically with HUD above the board
- Use safe-area padding to avoid notch overlap
- Safe-area and shell padding values are configurable (CSS variables)

## Non-Functional Requirements

- No layout jitter while resizing or rotating the device
- Maintain current desktop layout

## UX Notes

- HUD remains above the board with balanced breathing space

## Definition of Done (DoD)

- Mobile layout centers board with consistent padding
- Safe-area insets applied on supported devices

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
