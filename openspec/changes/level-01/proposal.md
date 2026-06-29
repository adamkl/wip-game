## Why

The player currently runs on a temporary floor. This change ports the PICO-8 level to a Tiled map and integrates it with Kaplay, giving the player real geometry to move through and establishing the pipeline all future levels will use.

## What Changes

- Create `assets/maps/level-01.tmj` — a Tiled map reproducing the PICO-8 level layout
- Create `assets/maps/tileset.tsj` — a Tiled tileset referencing `sprites/spritesheet.png`
- Load the map in Kaplay using `loadTiledMap()` + `addLevel()` or the Kaplay Tiled plugin
- Remove the temporary floor from the `game` scene
- Add camera that follows the player (Kaplay's `camPos()` or `follow()`)
- Tile collision driven by Tiled's tile property `solid: true` — no hardcoded tile indices in game code

## Capabilities

### New Capabilities

- `tilemap`: Tiled-based level loading, tile collision, camera follow

### Modified Capabilities

_(none — the temporary floor in `player-controller` is replaced, not a spec change)_

## Impact

- Depends on `project-setup` (spritesheet) and `player-movement` (player entity)
- Adds `assets/maps/level-01.tmj`, `assets/maps/tileset.tsj`
- Modifies `src/scenes/game.ts` to load and render the tilemap, remove temp floor
- Sets the pattern for all future levels: one `.tmj` per level, same tileset
