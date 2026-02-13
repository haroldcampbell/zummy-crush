# Spec: I002-M010-S002: HUD Cleanup + Info Menu

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

The bottom "Ready" status is noisy and the Info button placement is intrusive on mobile.

## Goals

- Remove the "Ready" status text
- Move Info behind a compact menu affordance (e.g., hamburger)

## Non-Goals

- Adding new HUD data

## Functional Requirements

- Status text area is removed or hidden when not needed
- Info is accessible via a small menu button in the HUD
- Menu can open the scoring guide

## Non-Functional Requirements

- Must be accessible and usable on touch

## UX Notes

- Menu button should be visible but not dominant

## Definition of Done (DoD)

- Status text no longer shows "Ready"
- Info button is relocated into a menu

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated (not applicable)
- [x] Docs updated
