## 1. Archive specs into the project spec store

- [x] 1.1 Archive `player-movement` spec (`openspec archive backfill-game-specs` or move `specs/player-movement/spec.md` to `openspec/specs/player-movement/spec.md`)
- [x] 1.2 Archive `character-cycling` spec into `openspec/specs/character-cycling/spec.md`
- [x] 1.3 Archive `touch-controls` spec into `openspec/specs/touch-controls/spec.md`
- [x] 1.4 Archive `tiled-level` spec into `openspec/specs/tiled-level/spec.md`
- [x] 1.5 Archive `camera-follow` spec into `openspec/specs/camera-follow/spec.md`

## 2. Verify specs reflect actual behaviour

- [x] 2.1 Cross-check `player-movement` scenarios against `src/entities/player.ts` — confirm MOVE_ACCEL, MOVE_SPEED, MOVE_FRICTION, JUMP_FORCE values and flipX logic match
- [x] 2.2 Cross-check `character-cycling` scenarios against the X-key handler and ANIMATED_CHARS set in `src/entities/player.ts`
- [x] 2.3 Cross-check `touch-controls` scenarios against `src/input/touch-controls.ts` and `index.html`
- [x] 2.4 Cross-check `tiled-level` scenarios against `src/level/tiled-loader.ts` — confirm TILE_SIZE calculation and solid-tile filtering logic
- [x] 2.5 Cross-check `camera-follow` scenarios against the `k.onUpdate` block in `src/scenes/game.ts`

## 3. Update openspec project context

- [x] 3.1 Add a `context` block to `openspec/config.yaml` describing the tech stack (Vite + TypeScript + Kaplay, PICO-8-inspired pixel art, 512×512 canvas, 4× display scale) so future AI-assisted spec work has accurate background
