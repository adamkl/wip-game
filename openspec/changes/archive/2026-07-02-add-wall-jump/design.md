## Context

`feat/wall_jump` (in `adamkl/pico-8`, fetched via `raw.githubusercontent.com` since the port has no local copy of the cart) diverged from `master` with: wall-slide/wall-jump physics, retuned `a_run`/`a_jump`, friction applying in the air, an explicit on_ground/on_wall reset-on-leave fix, removal of the 6-character selection system in favor of a single character with 4 physics-driven animation states, and three new floating-platform tiles in the level. The prior session confirmed (via `git diff` between the two fetched carts) this is the complete list — no other gameplay-relevant changes exist on the branch.

Kaplay's `body()` component has no wall-jump primitive. It exposes `isGrounded()`, `onGround`/`onFall`/`onHeadbutt` events, and a mutable `gravityScale` field, all built around a single `curPlatform` concept for **vertical** contact. There's no equivalent `on_wall` concept — this has to be built from `area()`'s `Collision` object, which does expose `isLeft()`/`isRight()` alongside the `isTop()`/`isBottom()` already used internally by `body()` (confirmed against `node_modules/kaplay/dist/types.d.ts`).

## Goals / Non-Goals

**Goals:**
- Wall-slide and wall-jump feel matches the source branch's Lua logic as closely as Kaplay's physics model allows.
- Reuse `body()`'s existing grounded/gravity machinery where possible rather than replacing it — only add what's missing (wall contact tracking, conditional gravity scale, the wall-jump input branch).
- Ship the constant retuning and level tweak alongside the mechanic, since they're the same source branch and separating them would leave the port in a state that matches neither `master` nor `feat/wall_jump`.

**Non-Goals:**
- Video-verifying the new constants against real footage of the branch running. We have no way to run `feat/wall_jump` (it's not deployed anywhere, and there's no PICO-8 emulator in this environment) — unlike the earlier `GRAVITY` retune, these numbers are derived from the source ratios, not measured. Flagged as a known gap, not solved here.
- Re-adding character selection in any form — proposal already settled this (Option A, full removal).
- New enemy/hazard sprites — the sheet has unused ghost/blob/creature art left over from the removed character roster, but nothing in either cart's Lua code spawns or uses them as enemies. Out of scope.

## Decisions

**`JUMP_FORCE` and `MOVE_ACCEL`: convert via the same formula as the rest of `config.ts`, not by ratio-scaling the already-tuned values.** `a_jump` isn't tick-rate-sensitive — it's a one-time velocity *set*, not a per-tick accumulation — so unlike `GRAVITY`, the literal `pico_val × DISPLAY_SCALE × 30` formula is exactly as valid for it now as it always was. `4.5 × 4 × 30 = 540`. This happens to land within 1 unit of naive ratio-scaling (`720 × 0.75 = 540`) anyway, but the formula is the more defensible derivation and is what's recorded in code comments.

**`MOVE_ACCEL` is scaled by ratio (`1800 × 0.8 = 1440`) as a pragmatic choice, with a caveat.** Unlike `JUMP_FORCE`, `MOVE_ACCEL` *is* a per-frame accumulation (applied every `onUpdate` tick), so it's structurally the same kind of quantity `GRAVITY` was — and `GRAVITY`'s formula-derived value turned out to be roughly 2× too strong once measured against real footage. `MOVE_ACCEL` was explicitly out of scope for that investigation (no video evidence gathered), so its current value (`1800`) was never verified either way. Ratio-scaling it by the branch's own `0.8` preserves whatever relationship it has to the (unverified) baseline, rather than introducing a new, unrelated number. If horizontal movement is later found to be similarly "too strong," both the base and wall-jump-scaled values will need revisiting together.

**Wall contact tracking: mirror `body()`'s grounded pattern with `onCollideUpdate`/`onCollideEnd`, not a custom raycast.** `onCollideUpdate("tile", (obj, col) => { if (col.isLeft() || col.isRight()) onWall = true })` sets the flag while overlap continues; `onCollideEnd("tile", () => onWall = false)` clears it when contact stops. This is the same event-driven shape `body()` uses internally for `curPlatform`, so it stays consistent with the existing collision model rather than introducing a parallel swept-collision system (which was the actual mechanism in the Lua original, but re-implementing it wholesale is a much bigger, riskier change than this feature needs).

**Wall-slide gravity: toggle `player.gravityScale` directly, don't fight `body()`'s internal gravity application.** `gravityScale` is already a live-mutable field `body()` reads every physics tick (confirmed in the `fixedUpdate` source read during the earlier floatiness investigation). Setting `player.gravityScale = (onWall && player.vel.y > 0) ? WALL_SLIDE_GRAVITY_MULT : 1` once per `onUpdate` reproduces the Lua branch's `g_mult` logic exactly, without needing to bypass `body()`'s gravity integration.

**Wall-jump impulse: set velocity directly, don't call `player.jump()`.** The existing `player.jump()` (used for ground jumps) only touches `vel.y`. Wall-jump needs both axes set simultaneously (`vel.y = -WALL_JUMP_FORCE`, `vel.x = ±MOVE_SPEED` away from facing direction), so it's a direct `player.vel = vec2(...)` assignment in the jump input handler's wall-jump branch, parallel to (not reusing) the existing ground-jump branch.

**Animation: replace the velocity-threshold idle/run toggle with an explicit 4-state switch,** matching the branch's `animate()`: grounded+moving → run, grounded+still → stand, on_wall+falling → wall-slide, else (airborne, not wall-sliding) → jump. This subsumes the current `ANIMATED_CHARS`/threshold logic entirely, since there's only one character now.

## Risks / Trade-offs

**`MOVE_ACCEL`'s correctness is inherited uncertainty, not resolved here** → Flagged above; if it turns out to be off, this change's `1440` would need re-deriving alongside a fresh `1800` baseline, not treated as independently correct.

**No ground-truth video for wall-jump feel** → Mitigate by feel-testing after implementation (manual playtest task) and treating the constants as a good-faith starting point, not a verified target the way the plain-jump `GRAVITY` was.

**Friction-in-air is a broader behavior change than wall-jump itself** → It affects every airborne moment, not just post-wall-jump coasting (e.g., regular jump arcs now decelerate horizontally too, if any horizontal input was held). Worth a quick full-level playtest, not just wall-jump-specific testing, since it's a global movement change riding along with this feature.

**Sprite sheet regeneration touches `scripts/extract-sprites.ts`'s embedded hex data** → This is hand-transcribed from the fetched cart's `__gfx__` section, same process used for the original port. Mistranscribing a row silently produces wrong pixels rather than an error; needs a visual diff against the rendered branch reference image (already captured this session) before considering it done.
