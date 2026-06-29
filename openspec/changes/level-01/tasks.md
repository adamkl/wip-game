# Tasks

## Tiled Assets

- [ ] Create `assets/maps/` directory
- [ ] Create `assets/maps/tileset.tsj` — 2 tiles (8×8 each), sourced from `public/sprites/spritesheet.png` at (0,64) and (8,64); set custom property `solid: true` on both tiles
- [ ] Create `assets/maps/level-01.tmj` — 16×14 map, single layer `"tiles"`, tile size 8×8, reproduce the layout from design.md (walls at cols 0/15, platforms, floor at rows 12-13)

## Kaplay Integration

- [ ] In `vite.config.ts`, ensure `assets/maps/` is served as static (or move to `public/maps/`)
- [ ] In `src/main.ts`, add `k.loadTiledMap("level-01", "maps/level-01.tmj")` before scene start
- [ ] In `src/scenes/game.ts`, replace `addTiledMap("level-01")` call (or equivalent) for the map — verify solid tiles get `area()` + `body({isStatic:true})` automatically
- [ ] Remove the temporary static floor rect

## Camera

- [ ] Add camera follow in `onUpdate`: clamp to map bounds (128px wide × 112px tall at scale 1)
- [ ] Update `DISPLAY_SCALE` to `4` in `src/config.ts`
- [ ] Update `kaplay()` call in `main.ts` to use the new canvas size (`512×448` or `width: 128, height: 112, scale: 4`)

## Verify

- [ ] Player spawns at correct position and lands on the floor
- [ ] Player cannot walk through walls or platforms
- [ ] Player can jump up to the upper platforms
- [ ] Camera follows player without showing black space outside the map
- [ ] No hardcoded tile indices remain in `game.ts`
