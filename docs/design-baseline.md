# Design Baseline (WIP)

Purpose: Provide shared UI/UX defaults used by specs so implementation is consistent and predictable.

## Target Viewports (Mobile-First)

- Primary: 360 x 640 (Android baseline)
- Secondary: 390 x 844 (iPhone 12/13/14 baseline)
- Use browser device emulation for quick checks.

## Board Layout

- Board size (M001): 3 x 3
- Board size (post-M001): 8 x 8
- Board pixel size: 300px baseline (scale up to 320px on wider viewports)
- Tile size: 34px baseline
- Tile spacing/gap: 4px baseline

## Typography

- Primary font: TBD
- Font sizes (HUD, tile letters): TBD
- Number style (score/timer): TBD

## Color + Contrast

- Tile colors (A–E): TBD
- Background color/gradient: TBD
- Text contrast target: TBD

## Interaction + Feedback

- Drag-to-swap (M001)
- Swap-back animation on invalid move
- Selection highlight style: TBD
- Animation timings (configurable): swap 0.5s, cascade 0.5s, match resolve 0.8s

## Number Formatting

- Score uses thousands separators (e.g., 12,345)

## Audio (Later Phase)

- Sound effects on swap/match (TBD)
- Audio can be toggled in settings (later phase)
