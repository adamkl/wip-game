## 1. Constants and level data

- [x] 1.1 Update `src/config.ts`: `JUMP_FORCE` 720 → 540 (formula: `4.5 × DISPLAY_SCALE × 30`), `MOVE_ACCEL` 1800 → 1440 (ratio-scaled 0.8× per design.md's caveat); add `WALL_JUMP_FORCE` (JUMP_FORCE × 0.75) and `WALL_SLIDE_GRAVITY_MULT` (0.2) constants
- [x] 1.2 Add the three new floating-platform tiles to `src/maps/level-01.json` rows 5–7 (columns 7-9, 11-12, 3-4 respectively, matching the branch's `__map__` diff)

## 2. Sprite sheet

- [x] 2.1 Update `scripts/extract-sprites.ts`'s embedded `__gfx__` hex data with the branch's new character row (5 frames: run×2, stand, jump, wall-slide) — transcribe from the fetched `wip_walljump.p8`
- [x] 2.2 Run `npm run extract-sprites`, visually diff the regenerated `public/sprites/spritesheet.png` against the rendered reference image from this session's investigation to catch transcription errors
- [x] 2.3 Update `src/main.ts`'s `loadSpriteAtlas()`: remove `char2`–`char6` entries (no longer referenced), update `char1`'s atlas region/anim definitions for the new 5-frame layout (run/stand/jump/wall-slide)

## 3. Player entity: wall contact and wall-slide

- [x] 3.1 In `src/entities/player.ts`, add an `onWall` tracked boolean, set via `onCollideUpdate` (untagged overload + manual `obj.is("tile")` check — the tagged overload has a type-def bug in this Kaplay version, return type wrongly declared as `KEventController` instead of `void`) and cleared via `onCollideEnd("tile", () => onWall = false)`
- [x] 3.2 In the per-frame update loop, set `player.gravityScale = (onWall && player.vel.y > 0) ? WALL_SLIDE_GRAVITY_MULT : 1`

## 4. Player entity: wall-jump and animation

- [x] 4.1 Rewrite the jump input handler: if `onWall && player.vel.y > 0`, set `player.vel.y = -WALL_JUMP_FORCE` and `player.vel.x = ±MOVE_SPEED` away from the last-faced direction (based on current `flipX`); else if `player.isGrounded()`, existing ground-jump behavior (`player.jump()`) applies unchanged. Extracted into a shared `doJump()` used by both keyboard and touch-control jump, so mobile players get wall-jump too.
- [x] 4.2 Remove `CHAR_SPRITES`, `ANIMATED_CHARS`, `charIndex`, and the X-key character-cycling handler entirely
- [x] 4.3 Replace the velocity-threshold animation logic with the 4-state switch: wall-slide (onWall && falling) → stand/run (grounded, by horizontal velocity) → jump (else)

## 5. Verify

- [x] 5.1 `tsc --noEmit` and `GITHUB_ACTIONS=true npm run build` succeed
- [x] 5.2 Headless-browser playtest: confirm wall-slide visibly slows descent against a wall, wall-jump launches away from the wall in the opposite direction, normal ground jump still works, X key no longer does anything — all confirmed via `window._k.k`: gravityScale drops to 0.2 + `wallslide` anim while sliding; jump while sliding set vy to the wall-jump impulse and vx to -264 (away from wall, flipX was true); X keypress produced no errors and no effect; new floating platforms visible in screenshots
- [x] 5.3 Measure grounded jump peak height via the `window._k.k` debug handle (as in the prior gravity-tuning session) — confirm it's in the neighborhood of the ~39 world-unit calculated target; this is a sanity check against a formula, not a video-verified measurement (no footage of this branch exists) — measured 38.9, matches target almost exactly
- [x] 5.4 Manual feel-check: since `MOVE_ACCEL` and the wall-jump constants aren't video-verified, confirm movement doesn't feel broken or unresponsive across a full playthrough of the level, not just the wall-jump-specific spot — scripted a walk/jump/climb/return run across the staircase area, no errors, no stuck states, friction decay reads smoothly whether grounded or airborne; this is a scripted sanity pass, not substitute for actual human playtest feel

## 6. Ship

- [x] 6.1 Archive this change (`openspec archive add-wall-jump`) so `openspec/specs/wall-jump/`, `openspec/specs/player-movement/`, and the removal of `openspec/specs/character-cycling/` all land — the archive tool couldn't rebuild a fully-emptied spec (validation rejects a 0-requirement spec), so `character-cycling`'s delta was applied manually: directory deleted from `openspec/specs/`, original REMOVED-requirements delta preserved at `openspec/changes/archive/2026-07-02-add-wall-jump/specs/character-cycling/spec.md` for provenance
- [ ] 6.2 Commit on a new branch off latest `origin/main`, push, and open a PR summarizing the source branch comparison, the mechanic, the constant derivation (and its unverified caveat), and the character-cycling removal as a breaking change
