# Spec: I002-M009-S001: VFX Baseline + Performance Budget

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

We need a lightweight, tuneable VFX system that runs smoothly on modern iPhone hardware.

## Goals

- Establish a particle/VFX baseline that is configurable
- Define performance budgets and graceful degradation

## Non-Goals

- High-fidelity GPU shaders
- External VFX libraries

## Functional Requirements

- Add a small particle system that renders on the existing canvas
- Configurable defaults for:
  - maxParticles
  - spawnRate
  - particleLifeMs
  - particleSizePx
  - particleSpeedPxPerMs
  - gravityPxPerMs
  - spreadRadians
  - colorPalette
  - alphaFalloff
- Budget cap: automatically drop particles when at max
- Debug toggle to show particle counts

## Non-Functional Requirements

- Maintain smooth play on modern iPhone devices
- No more than one additional render pass per frame

## UX Notes

- Particles should be subtle at baseline; larger effects can be tuned via config

## Definition of Done (DoD)

- Particle system exists with config-driven tuning
- Baseline effects are visible and performant

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
