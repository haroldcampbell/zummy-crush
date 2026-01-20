# Spec: M002-S002: Void Mask Support

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Support boards with voids (gaps) where no tiles exist.

## Goals
- Represent voids via a mask
- Prevent swaps into voids
- Ensure match detection ignores voids

## Non-Goals
- Board editor for creating masks

## Functional Requirements
- Define a mask schema (0/1 grid)
- Void cells do not render tiles
- Void cells are excluded from swaps and matches
- Tiles fall through voids but cannot occupy void cells

## Non-Functional Requirements
- Mask loading is deterministic

## UX Notes
- Void cells should be visually empty/neutral

## Data / State
- Board definition includes mask

## Decisions
- Mask format: 2D array of 0/1 integers (1 = tile present, 0 = void)
- Row/column order: rows top-to-bottom, columns left-to-right
- Validation: mask dimensions must exactly match grid size
- Visual: void cells render fully empty/transparent

## Definition of Done (DoD)
- Voids render correctly and block interaction
- Match detection ignores voids

## Out of Scope
- Irregular board shapes beyond mask support

## Acceptance Checklist

- [x] Spec reviewed
- [x] Implementation complete
- [ ] Tests added/updated
- [x] Docs updated
