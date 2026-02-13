# Hand-off: I002 Mobile + Power-Ups + VFX (M007-M009)

## Summary

- Implemented mobile cache-busting, board centering, and input affordance highlight.
- Reworked power-up visuals and progression (square/circle -> void/tornado) with configurable behaviors.
- Added particle system baseline, match clear bursts, power-up VFX, screen shake, and text bursts.

## Completed Items

- M007: Cache-busted assets, mobile safe-area centering, input affordance highlight.
- M008: Power-up visuals without badges, progression to void/tornado, configurable behaviors, debug match preview.
- M009: Particle system baseline, match clear VFX, power-up VFX (fire/explosion), screen shake, text bursts.

## Key Decisions

- Power-up matching uses `matchId` to support color-agnostic void/tornado.
- Void/tornado effects run as timed loops with configurable durations and tick/step intervals.
- VFX parameters are fully configurable via `assets/config/gameplay.json`.

## Risks / Notes

- Void/tornado loops perform repeated clear + collapse/refill cycles; may need tuning for pacing/perf.
- Text bursts currently trigger on match-4/5 and large score thresholds only.

## Next Steps

- Playtest on mobile to tune VFX counts, durations, and scoring multipliers.
- Consider scoring balance for void/tornado clears.
- Verify iOS Safari cache-busting behavior with real device reloads.
