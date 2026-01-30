# Spec: M006-S001: Activate Line Clear Power-Up

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Enable activation of line clear power-ups created in earlier slices.

## Goals
- Trigger line clear on swap activation

## Non-Goals
- Power-up chains

## Functional Requirements
- Power-up triggers on swap
- Clear row or column based on power-up orientation
- Swap involving line-clear is valid even without a normal match
- If line-clear swaps with another power-up, award a small bonus reward
- Line-clear tiles are letterless (variant-1) and can swap with any tile to activate

## Non-Functional Requirements
- Activation integrates with cascades

## UX Notes
- Visual feedback on activation

## Data / State
- Power-up type enum

## Decisions
- Activation only via swap (no tap)
- Allow activation on any swap involving line-clear, even if no match forms
- Power-up + power-up swap triggers line-clear and a bonus reward
- Variant-1 behavior (letterless, wildcard swap) ships now; variant-2 considered for M005 polish

## Definition of Done (DoD)
- Line clear power-ups activate and clear tiles

## Out of Scope
- Combined power-up effects

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [x] Tests added/updated
- [x] Docs updated
