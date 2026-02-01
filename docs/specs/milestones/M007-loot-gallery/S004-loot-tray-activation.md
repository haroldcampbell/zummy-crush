# Spec: M007-S004: Loot Tray + Activation Interaction

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Loot needs a distinct place off the board and an interaction that lets players choose when to apply it, without turning loot into board tiles.

## Goals
- Provide a lightweight loot tray below the board that is visually distinct from power-ups.
- Let players choose a loot item to arm/activate at a time of their choosing.
- Keep interaction minimal and non-intrusive.

## Non-Goals
- Full loot economy or persistence.
- Complex targeting effects or balance tuning.
- Power-up activation (handled in M006).

## Functional Requirements
- Loot tray displays collected loot items and counts.
- Loot tray appears below the board (not on the board).
- Loot items are not tiles and never participate in matches.
- Tap a loot item to arm it; the next board tap applies it (consumes one) and exits armed mode.
- Activation emits a lightweight event payload: `{ type, targetCell?, timestamp }`.
- If loot is armed and the player taps outside the board, the loot remains armed.

## Non-Functional Requirements
- Must not block core match flow when no loot is armed.
- Interaction must be usable on mobile (large tap targets).

## UX Notes
- Visually differentiate loot tokens from power-up tiles (shape or icon language).
- Armed state should be obvious (tray highlight + subtle board cue).
- Keep the tray minimal; avoid adding new panels or overlays.

## Data / State
- Session loot inventory (type, count).
- Armed loot type (nullable).

## Decisions
- Loot lives off-board in a tray and is player-triggered.
- Power-ups remain on-board and resolve automatically with normal match flow.
- Activation emits an event hook; gameplay effects are deferred to later specs.

## Definition of Done (DoD)
- Loot tray displays and tracks session loot.
- Loot can be armed and consumed on a chosen board tap.
- Activation event payload is emitted and logged (or observable for later wiring).

## Out of Scope
- Actual loot effects on board logic.
- Gallery overlay behavior (handled in S002/S003).

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
