# Milestone: M003 - Match-4 Slice (Power-Up + Loot + Micro-Reward)

## Principles Reference

- See `docs/principles.md` for non-negotiable workflow rules (including PR merge approval).

## Goal
Deliver a playable slice centered on match-4 power-ups with a basic loot trigger and a micro-reward.

## Scope (In)
- Match-4 power-up creation
- Match-4 loot trigger (minimal)
- Micro-reward for first power-up created
- Shared match event contract v1

## Scope (Out)
- Power-up activation
- Match-5 power-ups
- Loot gallery

## Success Criteria
- Match-4 creates a power-up tile
- Loot drops can be triggered from match-4 events
- Micro-reward triggers on first power-up creation

## Specs
- [ ] S001 - Match-4 Power-Up Creation
- [ ] S002 - Match-4 Loot Trigger (Minimal)
- [ ] S003 - Micro-Reward: First Power-Up Created
- [ ] S004 - Shared Event Contract v1

## Dependencies
- M002 board expansion

## Risks
- Event contract instability could create merge conflicts
