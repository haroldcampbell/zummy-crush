# Spec: M005-S003: Audio Hooks (Optional)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Add optional audio hooks for interactions without enabling sound by default.

## Goals
- Add event hooks for swap/match
- Ensure audio is optional and off by default

## Non-Goals
- Final sound design

## Functional Requirements
- Audio hooks exist for swap and match
- Audio can be toggled (off by default)

## Non-Functional Requirements
- No autoplay violations in browsers

## UX Notes
- Sound settings deferred to later phases

## Data / State
- Audio enabled flag

## Open Questions
- Sound asset sources TBD

## Definition of Done (DoD)
- Audio hooks wired (no actual assets required)

## Out of Scope
- Full sound library

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
