## Context

This session did a version-by-version audit of `adamkl/pico-8`'s `wip/wip.p8` across its full git history (5 commits total on the path):

| Commit | Message | Date | `a_jump` | `a_run` | wall-jump code |
|---|---|---|---|---|---|
| `13304f5` | "Feat/functional" | 2020-12-29 | `-6` | `0.5` | absent |
| `bcb6045` | "Add initial cut of wall jumps" | 2020-12-30 | `-5` | `0.4` | present |
| `cbbca51` | "refine wall jumping" | 2021-01-01 | `-4.5` | `0.4` | present |

`cbbca51` is both the current tip of `master` and the exact SHA of the `feat/wall_jump` branch ref — there is no divergence between them today, and there hasn't been since 2021. `world.g=0.5` and `world.friction=0.15` are identical across all three revisions.

The `retune-jump-physics` session fetched `13304f5`'s values (`a_jump=-6`) to compute a "formula-predicted" jump height (~137-144 wu) and compared that prediction against video of the deployed cart, which reflects `cbbca51` (`a_jump=-4.5`). Recomputing the same "formula-predicted" height using the correct `-4.5` value gives ~81 wu (continuous-ideal) / ~75.6 wu (Kaplay's actual discrete 50Hz tick, simulated this session) — within ~6% of the ~71 wu measured from video, well inside the noise of pixel-tracking a screen recording. No 2x discrepancy exists once the right revision is used, so no engine-speed correction (the "~60fps web export" theory) is needed.

`add-wall-jump` (same day as this change) independently fetched `cbbca51` while porting wall-jump and correctly set `JUMP_FORCE=540` (`4.5 × 4 × 30`, the literal formula — `a_jump` is a one-time velocity set, not tick-rate-sensitive). But it explicitly scoped out revisiting `GRAVITY`, leaving `3300` in place. That value was never valid on its own — it was tuned specifically to pair with the old (wrong-revision) `JUMP_FORCE=720`. Discrete-simulated this session: `JUMP_FORCE=540` + `GRAVITY=3300` peaks at **~39 wu**, half the correct target. This regression is already unknowingly documented in the current `player-movement` spec's Jump scenario, which cites "~39 world units" as expected behavior.

## Goals / Non-Goals

**Goals:**
- Restore the ported jump's peak height to match the original cart's actual behavior (~71-76 wu), by fixing `GRAVITY` back to the literal 30fps-formula value (`1800`) rather than an empirical multiplier.
- Correct the historical record: `config.ts`'s comments and the `player-movement` spec should no longer claim a "~60fps web export" engine quirk that a version-mismatch fully explains.

**Non-Goals:**
- Re-verifying `MOVE_SPEED`/`MOVE_ACCEL`/`MOVE_FRICTION`/`WALL_JUMP_FORCE` — all four were already derived from `cbbca51` (the correct, current revision) in `add-wall-jump`, and the source values they depend on (`v_x_max=2.5`, `friction=0.15`, `w_jump_mult=0.75`) are unchanged across all three historical revisions, so there's no version-mismatch risk for them the way there was for gravity/jump-force.
- Re-running the video pixel-tracking measurement from scratch — this change relies on discrete-tick simulation (matching the same methodology `retune-jump-physics` validated against real video) rather than new footage, since the corrected number already lands within the prior measurement's noise band. A build/preview sanity check is still in the tasks.
- Touching wall-jump mechanics, collision insets, or anything else `add-wall-jump`/`wall-jump-refinements` shipped — those are unaffected by this constant.

## Decisions

**Fix `GRAVITY` by reverting to the literal formula, not by re-deriving a new empirical multiplier.** The entire reason `GRAVITY` was ever pulled away from the formula-literal value was the apparent 2x discrepancy — which is now explained by the version mismatch, not a real engine-timing effect. Once the correct `a_jump=-4.5` is used, the literal formula's output (~75.6 wu discrete-simulated) already matches the measured original (~71 wu) within normal noise, so there's no remaining discrepancy to tune away.

**Trust discrete-tick simulation over re-recording video for verification.** `retune-jump-physics` established that Kaplay's actual 50Hz physics tick (not the continuous-ideal formula) is the right model to simulate against, and cross-validated it against real video. Re-running that same simulation methodology with corrected inputs (`JUMP_FORCE=540`, `GRAVITY=1800` → ~75.6 wu) is sufficient confidence for a revert of this size; the tasks still include an in-browser sanity check via the same `window._k` debug harness used previously, in case the live build's actual tick behavior differs from the offline simulation in some unaccounted way.

**Rewrite the `config.ts` comment to state the corrected derivation plainly, not just restore the old wording.** The old (pre-3300) comment simply stated the literal formula without explaining why. The new comment should note that `GRAVITY` follows the same literal-formula pattern as every other constant, and explain (briefly) why no empirical correction is needed — so a future investigator doesn't rediscover the same wrong turn from scratch.

## Risks / Trade-offs

**Confidence rests on `adamkl.github.io` deploying the `cbbca51` (current master) build specifically, which isn't independently re-confirmed by this session** (no PICO-8 emulator or ability to browse the deployed site was used here) → Low risk: `cbbca51` is the only revision with wall-jump mechanics fully present, and the deployed cart is known (from the original `retune-jump-physics` and `add-wall-jump` sessions) to include wall-jump — so it cannot be the pre-wall-jump `13304f5` revision the wrong prediction was based on. The remaining alternative (`bcb6045`, `a_jump=-5`) predicts ~90-95 wu — also closer to 71 than the current 39, but the tasks' build/preview check will confirm 1800 is right rather than assuming it.

**This reverts a change (`retune-jump-physics`) that included its own "verify empirically" task and passed it at the time** → Not a contradiction: that verification confirmed `GRAVITY=3300` matched `JUMP_FORCE=720`'s arc, which was correct *for the wrong `JUMP_FORCE`*. It was never re-verified after `add-wall-jump` changed `JUMP_FORCE` out from under it, which is the actual gap this change closes.
