## Overview

Use Kaplay's built-in Tiled map support. All level geometry lives in `.tmj` files; game code is level-agnostic. The Tiled tileset references the same `spritesheet.png` already loaded by `loadSpriteAtlas()`.

## PICO-8 Level Layout

The original map is 16 tiles wide × 14 tiles tall (128×112 pixels). Only the left 16 columns are populated:

```
Col:  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
Row 0-2:  (open sky)
Row 3:    W  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  W
Row 4-8:  W  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  W
Row 9:    W  ·  ·  ·  ·  ·  ·  ·  ·  ·  B  B  B  B  W  ·
Row 10:   W  ·  B  B  ·  ·  ·  ·  ·  B  W  W  W  W  W  ·
Row 11:   W  B  W  W  B  B  B  B  B  W  W  W  W  W  W  ·
Row 12:   W  W  W  W  W  W  W  W  W  W  W  W  W  W  W  ·
Row 13:   W  W  W  W  W  W  W  W  W  W  W  W  W  W  W  ·

W = tile_wall (sprite 129 / 0x81)
B = tile_block (sprite 128 / 0x80)
Player spawns at tile (8, 8) → pixel (64, 64)
```

## Tiled File Structure

```
assets/
└── maps/
    ├── tileset.tsj        # Tiled tileset — references ../../public/sprites/spritesheet.png
    └── level-01.tmj       # Tiled map — embeds tileset reference, one "tiles" layer
```

**tileset.tsj** — 2 tiles (indices 0 and 1), each 8×8, from the sprite sheet:
- Tile 0: x=0,  y=64 (tile_block / sprite 128) — `solid: true`
- Tile 1: x=8,  y=64 (tile_wall / sprite 129)  — `solid: true`

Both tiles have a custom property `solid: true` used by Kaplay for collision.

**level-01.tmj** — 16×14 tile map, single layer `"tiles"`, tile size 8×8, referencing `tileset.tsj`.

## Kaplay Integration

```typescript
// src/scenes/game.ts
await k.loadTiledMap("level-01", "maps/level-01.tmj")

scene("game", () => {
  const map = k.addTiledMap("level-01")
  // Kaplay auto-adds area() + body({isStatic:true}) for tiles with solid:true

  const player = spawnPlayer(k, k.vec2(64, 64))
  // Remove the temporary floor — real geometry handles it now
})
```

If Kaplay's Tiled plugin is not available in the installed version, fall back to `addLevel()` with a symbol-to-tile mapping — but prefer the Tiled plugin so the pipeline works for future levels without code changes.

## Camera

```typescript
k.onUpdate(() => {
  k.camPos(player.pos)
})
```

Clamp camera to map bounds once the level size is confirmed:
```typescript
const clampedX = k.clamp(player.pos.x, k.width()/2, mapWidth - k.width()/2)
k.camPos(k.vec2(clampedX, player.pos.y))
```

## Display Scale

With the level being 128×112 pixels, a 4× scale gives a 512×448 canvas — a reasonable size. Set `DISPLAY_SCALE = 4` in `config.ts` (initially set to 2 in project-setup, update here once level size is confirmed).
