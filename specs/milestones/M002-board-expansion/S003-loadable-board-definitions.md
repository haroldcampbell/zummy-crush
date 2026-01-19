# Spec: M002-S003: Loadable Board Definitions

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Problem Statement
Load board layouts from a static JSON file to allow multiple boards without code changes.

## Goals
- Define a board JSON format
- Load a board definition at startup
- Support future expansion to multiple boards

## Non-Goals
- Server-side board delivery
- Full board editor

## Functional Requirements
- Board definition contains grid size, mask, and metadata
- Game uses board definition to initialize grid
- Support multiple boards via an index file

## Non-Functional Requirements
- Board file is easy to edit manually

## UX Notes
- None

## Data / State
- Board definition source is local file

## Decisions
- File location: `app/assets/boards/<theme>/board-<level>.json`
- Index file: `app/assets/boards/index.json` lists themes and board file paths
- Default selection: first entry in the index file
- Immediate content: include an `easy` theme with 3 boards
- Metadata fields (minimum): `id`, `name`, `theme`, `level`, `grid` (rows/cols), `mask`

## Definition of Done (DoD)
- Board loads from JSON file
- Swaps/matches respect loaded definition

## Out of Scope
- Dynamic board selection UI

## Acceptance Checklist

- [ ] Spec reviewed
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Docs updated
