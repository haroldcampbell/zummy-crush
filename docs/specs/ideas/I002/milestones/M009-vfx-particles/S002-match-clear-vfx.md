# Spec: I002-M009-S002: Match Clear VFX

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Match clears feel muted without visual feedback on mobile.

## Goals

- Add VFX for row/column clears
- Add VFX for standard match clears

## Non-Goals

- Audio or haptics

## Functional Requirements

- Row/column clear emits directional particle burst along the cleared line
- Standard match clear emits a compact burst centered on the matched tiles
- Configurable defaults for:
  - burstCount
  - burstLifeMs
  - burstSizePx
  - burstSpeedPxPerMs
  - directionalSpreadRadians
  - burstColorMode (tile color, neutral, or gradient)

## Non-Functional Requirements

- VFX must not reduce input responsiveness

## UX Notes

- Effects should be readable but not overpower the tiles

## Definition of Done (DoD)

- Match clear VFX are visible and tuned via config

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated (not applicable)
- [x] Docs updated
