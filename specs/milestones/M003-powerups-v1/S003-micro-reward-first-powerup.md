# Spec: M003-S003: Micro-Reward: First Power-Up Created

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Provide a small celebratory micro-reward when the first power-up is created.

## Goals
- Trigger feedback on the first power-up creation in a session
- Keep UI lightweight and non-blocking

## Non-Goals
- Complex progression or achievement systems

## Functional Requirements
- Detect the first power-up creation per session
- Trigger a small toast/sparkle feedback
- Include a cooldown to prevent repeat triggers

## Non-Functional Requirements
- Feedback must not interrupt gameplay

## UX Notes
- Subtle, celebratory feedback

## Data / State
- Session flag: first power-up created

## Decisions
- Trigger only once per session

## Definition of Done (DoD)
- Micro-reward feedback triggers on first power-up creation

## Out of Scope
- Additional micro-reward types

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
