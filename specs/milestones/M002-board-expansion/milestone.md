# Milestone: M002 - Core Board Expansion (8x8 + voids)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Goal
Expand the core board to 8x8, support voids (gaps), and allow loadable board definitions.

## Scope (In)
- 8x8 board rendering
- Board masks for voids/gaps
- Loadable board definitions (static JSON file)
- Ensure match logic respects voids

## Scope (Out)
- Board editor UI
- Server-side validation
- Themed boards or story progression

## Success Criteria
- 8x8 board renders correctly
- Voids are respected by swaps and matches
- Boards can be loaded from a definition file

## Specs
- [x] S001 - 8x8 Board Layout
- [x] S002 - Void Mask Support
- [x] S003 - Loadable Board Definitions
- [ ] S004 - Gravity + Repulsion Feel Experiment

## Dependencies
- M001 POC

## Risks
- Void handling could complicate match resolution
