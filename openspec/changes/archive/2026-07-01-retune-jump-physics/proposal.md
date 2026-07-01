## Why

Side-by-side video comparison against the original PICO-8 cart (`adamkl/pico-8`) shows the ported jump reaches nearly double the height of the original — confirmed via calibrated pixel-tracking of both recordings (original: ~71 world-units-equivalent peak height; port: ~137 world units, a ~1.9× difference). The current `JUMP_FORCE`/`GRAVITY` values in `config.ts` were derived by converting the Lua source's per-frame constants assuming standard PICO-8 30fps semantics, but the deployed original cart's HTML5/WASM export appears to run its update loop at roughly double that rate, so the "faithful" formula conversion no longer matches what the original actually looks like on screen. Since the goal of the port is to visually match the original, the constants need to be retuned against the measured footage rather than the formula-derived values.

## What Changes

- Lower `JUMP_FORCE` and/or raise `GRAVITY` in `src/config.ts` so a vertical jump peaks at approximately 71 world units (measured empirically) instead of the current ~137 world units.
- Re-verify `MOVE_SPEED`/`MOVE_ACCEL`/`MOVE_FRICTION` are not similarly affected (out of scope unless evidence emerges; this proposal focuses on the confirmed vertical jump-height discrepancy).
- Update the `player-movement` spec's jump requirement to reflect the empirically-tuned value instead of the formula-derived one, and note that the constants are tuned to match observed original gameplay rather than derived purely from source constants.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `player-movement`: The "Jump" requirement's velocity/height numbers change from the formula-derived `JUMP_FORCE=720 wu/s` (peaking ~137 world units) to empirically-tuned values that peak at ~71 world units, matching the original PICO-8 cart's measured jump height.

## Impact

- `src/config.ts`: `JUMP_FORCE` and/or `GRAVITY` constants change
- `openspec/specs/player-movement/spec.md`: jump requirement updated with new expected values
- No changes to input handling, collision, or other movement code
