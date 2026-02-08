# Spec: I002-M009-S003: Power-Up VFX

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Power-ups need richer visual feedback when created and activated.

## Goals

- Add distinct VFX for power-up creation and activation
- Include fire/explosion-style effects for higher-tier power-ups

## Non-Goals

- Full cinematic sequences

## Functional Requirements

- Power-up creation emits a small ring burst
- Power-up activation emits a larger burst plus a trailing effect
- Fire/explosion effect for White Square and Black Omni-Circle
- Configurable defaults for:
  - createBurstCount
  - createBurstLifeMs
  - activateBurstCount
  - activateBurstLifeMs
  - explosionCount
  - explosionLifeMs
  - explosionSizePx
  - explosionSpeedPxPerMs
  - trailLengthPx
  - trailLifeMs

## Non-Functional Requirements

- Must respect global particle budget

## UX Notes

- Fire and explosions should feel punchy but not obscure the board

## Definition of Done (DoD)

- Power-up VFX are visible and configurable

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
