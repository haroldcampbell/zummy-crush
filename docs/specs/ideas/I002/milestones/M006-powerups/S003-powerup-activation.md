# Spec: I002-M006-S003: Power-Up Activation (Line/Color Clear)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement

Power-up tiles should activate when they are part of a match, clearing additional tiles.

## Goals

- Line-clear power-up clears a full row or column
- Color-clear power-up clears all tiles of its color

## Non-Goals

- Tap-to-activate

## Functional Requirements

- If a match includes a line-clear tile, clear its row or column
- If a match includes a color-clear tile, clear all tiles with the same typeId
- Power-up activation occurs after match detection but before gravity

## Non-Functional Requirements

- Avoid double-clearing or errors when multiple power-ups activate

## UX Notes

- Activation should be immediate and obvious

## Notes

- Assumption: Line-clear orientation is chosen based on match direction (row for horizontal, column for vertical).

## Definition of Done (DoD)

- Power-up matches clear the expected tiles

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
