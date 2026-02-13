# Spec: I002-M009-S004: Screen Shake + Text Bursts

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

High-energy moments need additional feedback to feel rewarding.

## Goals

- Add subtle board shake for big power-ups
- Add text bursts for match milestones and big scores

## Non-Goals

- Large camera shake that disrupts play

## Functional Requirements

- Board shake on high-tier power-up activation (tuned, subtle)
- Text bursts for: Match 4, Match 5, 1000 points, Super!, etc.
- Configurable defaults for:
  - shakeDurationMs
  - shakeIntensityPx
  - textBurstLifeMs
  - textBurstSizePx
  - textBurstVelocityPxPerMs
  - textBurstMessages

## Non-Functional Requirements

- Shake must not cause motion sickness or obscure tiles

## UX Notes

- Keep text bursts readable and short-lived

## Definition of Done (DoD)

- Shake and text bursts are visible and configurable

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated (not applicable)
- [x] Docs updated
