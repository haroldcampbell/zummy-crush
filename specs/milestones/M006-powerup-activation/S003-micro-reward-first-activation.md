# Spec: M006-S003: Micro-Reward: First Power-Up Activation

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Provide a small celebratory micro-reward when the first power-up activation occurs.

## Goals
- Trigger feedback on first activation per session
- Keep UI lightweight and non-blocking

## Non-Goals
- Complex progression or achievements

## Functional Requirements
- Detect first activation per session
- Trigger a small toast/sparkle feedback

## Non-Functional Requirements
- Feedback must not interrupt gameplay

## UX Notes
- Subtle, celebratory feedback

## Data / State
- Session flag: first activation

## Decisions
- Trigger only once per session

## Definition of Done (DoD)
- Micro-reward feedback triggers on first activation

## Out of Scope
- Additional micro-reward types

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
