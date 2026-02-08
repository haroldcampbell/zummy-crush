# Spec: I002-M007-S003: Mobile Input Affordances

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Mobile input can feel imprecise without visual affordances that confirm intent.

## Goals

- Improve touch clarity without changing match logic
- Make selection and drag direction easier to read

## Non-Goals

- Haptics
- New game mechanics

## Functional Requirements

- Provide a subtle pre-drag highlight of the selected row/column
- Keep feedback lightweight and non-distracting

## Non-Functional Requirements

- No impact on match resolution timing
- Maintain performance on modern iPhone devices

## UX Notes

- Feedback should feel closer to Bejeweled-style line clarity

## Definition of Done (DoD)

- Input affordance is visible on touch without disrupting play

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
