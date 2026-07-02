## Why

The `retune-jump-physics` change (2026-07-01) tuned `GRAVITY` from `1800` to `3300` to compensate for what looked like a ~2x jump-height mismatch against the original PICO-8 cart. Re-deriving the source values this session found the real cause: that investigation fetched `player.a_jump=-6` from commit `13304f5` ("Feat/functional"), a **pre-wall-jump** revision of `adamkl/pico-8`'s `wip/wip.p8`. The deployed cart (and the video recorded of it) reflects the final `cbbca51` revision ("refine wall jumping"), where `a_jump` was already retuned to `-4.5`. The "original jumps half as high as predicted" symptom was two cart revisions being compared, not a 30fps-vs-60fps engine quirk.

`add-wall-jump` (2026-07-02) later fetched the correct revision and fixed `JUMP_FORCE` to `540` (matching `a_jump=-4.5`), but explicitly left `GRAVITY` at `3300` as out of scope. That silently broke the jump: simulated against Kaplay's actual discrete 50Hz physics tick, `JUMP_FORCE=540` + `GRAVITY=3300` peaks at **~39 world units** — nearly half the ~71 wu the original cart actually shows on screen (confirmed by the current player-movement spec's own "Jump peak height" scenario, which documents this ~39 wu figure as current behavior). `GRAVITY` was tuned to compensate for a `JUMP_FORCE` value that no longer exists in the code.

With the correct source revision, no empirical/engine-speed correction is needed at all: `GRAVITY = world.g × DISPLAY_SCALE × 30² = 0.5 × 4 × 900 = 1800`, the literal 30fps formula already used for every other constant. Simulated with `JUMP_FORCE=540`, that peaks at ~75.6 wu — within ~6% of the ~71 wu measured from video, comfortably inside pixel-tracking noise.

## What Changes

- Revert `GRAVITY` in `src/config.ts` from `3300` back to `1800` (the literal 30fps-formula value), removing the "empirically tuned for ~60fps web export" rationale — that theory was an artifact of comparing two different source revisions, not a real engine behavior.
- Update the `player-movement` spec's Jump requirement to reflect the corrected peak height (~75 wu, matching the original) instead of the current ~39 wu regression.
- No other constants change: `JUMP_FORCE` (540), `MOVE_SPEED` (300), `MOVE_ACCEL` (1440), `MOVE_FRICTION` (540), `WALL_JUMP_FORCE`, and `WALL_SLIDE_GRAVITY_MULT` were all already derived from the correct `cbbca51` source revision and are unaffected.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `player-movement`: The Jump requirement's `GRAVITY` value and documented peak height change from the current `3300` / ~39 wu (a regression from an unreconciled prior fix) back to `1800` / ~75 wu, matching the original cart's measured jump height.

## Impact

- `src/config.ts`: `GRAVITY` constant changes from `3300` to `1800`; derivation comment rewritten
- `openspec/specs/player-movement/spec.md`: Jump requirement's gravity value and peak-height scenario updated
- No changes to input handling, collision, wall-jump, or any other movement code
