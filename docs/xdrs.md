# XDRs (Experience Decision Records)

Intent: Record key experience decisions that affect player feel, pacing, and perception (distinct from technical ADRs).

This document will hold:
- Decision context and motivation (player experience)
- Alternatives considered
- Decision outcome and expected effect on feel
- Validation notes (playtest findings)

Status: Active. Experience-level decisions are now tracked below.

---

## XDR-001: No Pre-Match Start

Context
- Players reported confusion when the board spawns with pre-existing matches.

Alternatives Considered
- Allow pre-matches for faster early clears.
- Force a short shuffle animation to “clean” the board.

Decision
- Boards must never start with pre-existing matches.

Expected Effect
- Clearer sense of player agency at the start of each board.

Validation Notes
- Re-check during playtests; matches should only occur after player action.

---

## XDR-002: Bottom-First Cascades, No Overlap

Context
- Cascades felt like blocks teleporting; overlapping tiles reduced readability.

Alternatives Considered
- Simultaneous column drops.
- Stagger top-first for a waterfall effect.

Decision
- Cascades resolve bottom-first per column.
- Tiles do not overlap during cascades (overlap only allowed during swap).

Expected Effect
- Gravity feels more physical and readable.

Validation Notes
- Watch for “stacked plate” feel during cascades.

---

## XDR-003: Spawn Only When Space Opens

Context
- New tiles appeared before space was visually available.

Alternatives Considered
- Spawn immediately above the column on collapse.
- Fade-in tiles without fall.

Decision
- New tiles only spawn after space opens during cascades.

Expected Effect
- Clearer visual cause/effect; fewer perceived overlaps.

Validation Notes
- Confirm no new tiles appear before the lowest open space is visible.

---

## XDR-004: Selection Highlight = Full-Tile Color

Context
- Outline highlight was easy to miss and felt visually noisy.

Alternatives Considered
- Thicker outline.
- Glow or drop shadow.

Decision
- Selection highlight fills the entire tile with a distinct color.

Expected Effect
- More readable selection state on small screens.

Validation Notes
- Check contrast against tile letter and background.

---

## XDR-005: Gap Matches Padding

Context
- Tiles felt tightly packed; board edges felt inconsistent.

Alternatives Considered
- Increase gap only.
- Increase padding only.

Decision
- Tile gap should match board padding for consistent spacing.

Expected Effect
- Improved readability and visual rhythm.

Validation Notes
- Check 360x640 baseline for legibility.

---

## XDR-006: Loot Is Off-Board and Player-Triggered; Power-Ups Are On-Board and Automatic

Context
- Players need a clear mental model for loot vs power-ups.
- Loot should feel like a collect-and-spend resource, while power-ups are part of the core match loop.

Alternatives Considered
- Treat loot as special tiles that appear on the board.
- Auto-apply loot immediately on drop (no player choice).

Decision
- Loot lives off-board in a tray and is player-triggered at a chosen time.
- Power-ups remain on the board and resolve automatically through normal match flow.

Expected Effect
- Clearer separation between tactical (power-up) and strategic (loot) actions.
- Reduced board clutter and higher player agency for loot usage.

Validation Notes
- Check that players can explain the difference after a short playtest.
- Watch for confusion about when loot applies vs power-ups.
