# Spec: I002-M004-S002: Physics-Based Spawn + Cascade Animation

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

New tiles appear instantly, which makes cascades feel flat compared to I001.

## Goals

- Animate new tiles falling in with physics-based motion
- Animate cascade motion with readable offsets

## Non-Goals

- Particle effects or sound

## Functional Requirements

- Spawned tiles animate from above the board into their final cells
- Cascade motion uses physics offsets (gravity + bounce)
- Animation integrates with the cascade loop without breaking input lock

## Non-Functional Requirements

- No visible tile overlap (align with I001 XDR-002)

## UX Notes

- Keep per-cascade timing comparable to I001

## Notes

- Assumption: Spawn animation can reuse I001 cascade parameters.

## Definition of Done (DoD)

- New tiles visibly fall into place instead of popping in

## Out of Scope

- Screen shake or VFX

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
