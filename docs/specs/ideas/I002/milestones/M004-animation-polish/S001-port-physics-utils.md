# Spec: I002-M004-S001: Port Physics Utilities from I001

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

I002 currently uses instant refill visuals; the I001 physics model provides a more physical feel.

## Goals

- Reuse I001 physics utilities for tile motion
- Keep the integration modular and configurable

## Non-Goals

- Changing gameplay logic

## Functional Requirements

- Copy or import physics utilities from I001 into I002
- Expose physics parameters in config

## Non-Functional Requirements

- Maintain acceptable performance on mobile

## UX Notes

- Favor readability over speed

## Notes

- Assumption: I001 physics settings are a good baseline for I002.

## Definition of Done (DoD)

- I002 can compute physics-driven offsets for cascades/spawns

## Out of Scope

- Advanced VFX

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
