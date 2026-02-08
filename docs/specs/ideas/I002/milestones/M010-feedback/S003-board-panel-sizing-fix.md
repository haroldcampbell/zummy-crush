# Spec: I002-M010-S003: Board Panel Sizing Fix

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

The board panel height grows with page size, creating extra whitespace and misalignment.

## Goals

- Keep the board panel sized to its content
- Prevent stretching on tall viewports

## Non-Goals

- Redesigning the board panel style

## Functional Requirements

- Board panel height is intrinsic to the board content
- No vertical stretching on large screens

## Non-Functional Requirements

- Preserve current spacing and shadows

## UX Notes

- Panel should feel tight and anchored around the board

## Definition of Done (DoD)

- Board panel does not expand with viewport height

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
