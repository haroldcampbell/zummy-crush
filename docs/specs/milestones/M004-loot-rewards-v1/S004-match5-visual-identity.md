# Spec: M004-S004: Match-5 Visual Identity

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Match-5 power-ups need a distinct, stronger visual identity than match-4.

## Goals
- Make match-5 tiles visually distinct at a glance
- Preserve readability on mobile

## Non-Goals
- Full art pipeline or complex VFX

## Functional Requirements
- Match-5 power-up tiles have a stronger visual treatment than match-4
- Visuals are consistent with existing tile style

## Non-Functional Requirements
- No performance regressions

## UX Notes
- Consider brighter fill, icon, or border treatment
- Recommendation: brighter fill + higher-contrast stroke + distinct badge text ("X5" or "5") to keep the style consistent but clearly stronger than match-4.
- Apply to match-5 power-up types (currently color-clear), so future match-5 variants inherit the tiered style.
- Prefer config-driven overrides to keep the change reversible without code changes.
- Favor a warm gold/highlight palette with strong contrast for readability on small tiles.

## Data / State
- Visual variant or class for match-5 power-up tiles

## Decisions
- Keep the change reversible and configurable

## Definition of Done (DoD)
- Match-5 tile is clearly distinguishable from standard tiles and match-4

## Out of Scope
- Animated effects or sound

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
