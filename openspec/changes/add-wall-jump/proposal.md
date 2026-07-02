## Why

The original PICO-8 game has a `feat/wall_jump` branch (in the separate `adamkl/pico-8` source repo) that was never merged to `master` before this port began — so the port is missing wall-slide/wall-jump entirely, and also carries a character-selection system that branch had already replaced with a leaner, physics-state-driven single-character animation set. Porting that branch closes the gap between what's live and what the source project had actually moved on to.

## What Changes

- Add wall-slide: while airborne, falling, and touching a wall, gravity is reduced to 20% of normal, producing a slow slide down the wall face instead of a free fall.
- Add wall-jump: pressing jump while wall-sliding launches the player up (75% of a normal jump's velocity) and away from the wall (full `MOVE_SPEED` horizontally, opposite the direction the player was last facing). Ground jump keeps its existing trigger condition (still requires `on_ground`).
- Retune `JUMP_FORCE` (720 → 540 wu/s) and `MOVE_ACCEL` (1800 → 1440 wu/s²), matching the source branch's constant changes (`a_jump: -6 → -4.5`, `a_run: 0.5 → 0.4`) converted with the same formula used for the rest of `config.ts`. `GRAVITY` is unchanged (`world.g` is the same on both branches).
- Ground friction now applies while airborne too, not only while grounded (the branch removes that guard) — affects how quickly the wall-jump's horizontal kick decays.
- **BREAKING**: Remove character selection entirely — the X-key cycle through 6 characters is gone, matching the source branch. Only the first character remains, now with a proper 4-state animation set (run, stand, jump/airborne, wall-slide) driven by physics state instead of a velocity threshold.
- Port the branch's small level tweak: three new floating-platform tiles in rows 5–7 of `level-01`, apparently added to give room to test wall-jumping between narrow gaps.
- Regenerate the sprite sheet with the branch's new animation frames for the single remaining character (stand, jump, wall-slide poses — run frames already exist).

## Capabilities

### New Capabilities

- `wall-jump`: wall-slide (reduced gravity while pressed against a wall and falling) and wall-jump (directional launch off a wall), including the `on_wall` collision-state tracking this depends on.

### Modified Capabilities

- `player-movement`: `JUMP_FORCE` and `MOVE_ACCEL` constants change; ground friction now applies in the air as well as on the ground; sprite animation switches from a 2-frame velocity-threshold toggle to a 4-state system (run/stand/jump/wall-slide) driven by physics state.
- `character-cycling`: **removed entirely**. All three requirements (cycle with X key, animated characters, static characters) go away — there is only one playable character now.

## Impact

- `src/config.ts`: `JUMP_FORCE`, `MOVE_ACCEL` change; new `WALL_JUMP_FORCE`, `WALL_SLIDE_GRAVITY_MULT` constants
- `src/entities/player.ts`: new `on_wall` state tracking, wall-slide gravity scaling, wall-jump input branch, new animation state machine; removal of `CHAR_SPRITES`/`ANIMATED_CHARS`/character-cycling input handling
- `src/maps/level-01.json`: three new solid tiles (rows 5–7)
- `scripts/extract-sprites.ts` / `public/sprites/spritesheet.png`: new animation frames for the remaining character (stand, jump, wall-slide); characters 2–6 sprite data can stay in the sheet unused or be trimmed
- `src/main.ts`: `loadSpriteAtlas()` entries for characters 2–6 no longer needed
- `openspec/specs/character-cycling/`: removed at archive time
- `openspec/specs/player-movement/`, new `openspec/specs/wall-jump/`: updated/added at archive time
