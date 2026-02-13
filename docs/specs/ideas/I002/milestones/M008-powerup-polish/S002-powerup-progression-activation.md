# Spec: I002-M008-S002: Power-Up Progression + Activation Rules

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Power-up progression needs clearer rules and more satisfying high-tier behaviors.

## Goals

- Define a match-4 and match-5 progression path
- Add high-tier power-ups with clear effects (void and tornado)
- Keep matching rules predictable

## Non-Goals

- Particle effects (M009)
- New board mechanics beyond defined power-ups

## Functional Requirements

- Match-4 of Color A Shape X creates a Color A Square power-up
- Match-4 of Color A Squares creates a White Square power-up
- Match-5 of Color A Shape X creates a Color A Circle power-up
- Match-4 of Color A Circles creates a Black Omni-Circle power-up
- White Square and Black Omni-Circle are color-agnostic for matching

Void behavior (White Square)
- On match, a void persists for a configurable duration (default 3s)
- Tiles continuously fall into the void as they spawn
- Void affects a 3x3 area centered on the power-up location
- Tiles animate falling into the void and disappearing
- Void duration, tick rate, radius, and score multiplier are configurable

Tornado behavior (Black Omni-Circle)
- On match, tornado persists for a configurable duration (default 3s)
- Tornado path is random and zig-zaggy
- Tornado clears tiles it passes over
- Tornado duration, step rate, clear radius, and score multiplier are configurable

## Non-Functional Requirements

- Maintain stable performance on modern iPhone hardware
- Effects should not block core input beyond standard resolve timing

## UX Notes

- Power-up activation should be readable without text labels

## Definition of Done (DoD)

- Progression path implemented and verified
- Void and tornado effects follow configured durations and rules

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated (not applicable)
- [x] Docs updated
