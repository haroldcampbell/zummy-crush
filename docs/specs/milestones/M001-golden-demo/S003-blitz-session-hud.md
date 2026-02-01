# Spec: M001-S003: Blitz Session + HUD

## Problem Statement

Provide a short, time-limited session with a simple HUD to track time and score.

## Goals

- Add a blitz timer (configurable 30–120 seconds)
- Show time remaining and score
- End the session when time expires
- Provide a restart/reset control

## Non-Goals

- Level progression or story mode
- Persistence of score or sessions

## Functional Requirements

- Timer starts with session start
- Timer ends session cleanly
- Restart resets board, score, and timer

## Non-Functional Requirements

- Timer accuracy within reasonable browser limits

## UX Notes

- Keep HUD minimal, legible, and touch-friendly
- Reference: `docs/design-baseline.md` for typography and layout defaults.

## Data / State

- Session timer
- Session state (active/ended)

## Open Questions

  - Decision: default timer length is 60 seconds.

## Definition of Done (DoD)

- Timer visible and counts down
- Session ends on zero
- Reset works consistently

## Decisions / Notes

- Timer displays whole seconds for clarity.
- Session input is disabled when time expires.
- Tests: no automated tests in M001 POC (no harness yet).

## Out of Scope

- Best score tracking
- Shareable moments

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [ ] Tests added/updated
- [x] Docs updated
