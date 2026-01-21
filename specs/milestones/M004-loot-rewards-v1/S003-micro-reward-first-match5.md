# Spec: M004-S003: Micro-Reward: First Match-5

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Provide a celebratory micro-reward when the first match-5 occurs.

## Goals
- Trigger feedback on the first match-5 per session
- Keep UI lightweight and non-blocking

## Non-Goals
- Complex progression or achievement systems

## Functional Requirements
- Detect the first match-5 per session
- Trigger a small toast/sparkle feedback
- Include a cooldown to prevent repeat triggers

## Non-Functional Requirements
- Feedback must not interrupt gameplay

## UX Notes
- Subtle, celebratory feedback

## Data / State
- Session flag: first match-5

## Decisions
- Trigger only once per session

## Definition of Done (DoD)
- Micro-reward feedback triggers on first match-5

## Out of Scope
- Additional micro-reward types

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
