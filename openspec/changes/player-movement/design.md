## Overview

The player is a Kaplay game object composed of built-in components. No manual physics math — Kaplay's `body()` handles gravity and `area()` handles collision response.

## Player Entity

```typescript
// src/entities/player.ts
export function spawnPlayer(k: KAPLAYCtx, pos: Vec2) {
  return k.add([
    k.sprite("spritesheet", { anim: "char1_idle" }),
    k.pos(pos),
    k.area({ shape: new k.Rect(k.vec2(1, 2), 6, 6) }),  // inset bbox matching PICO-8 original
    k.body({ jumpForce: JUMP_FORCE }),
    k.scale(1),
    k.anchor("topleft"),
    "player",
  ])
}
```

## Config

```typescript
// src/config.ts
export const GRAVITY       = 980   // pixels/s² — tuned to feel like PICO-8 0.5/frame at 30fps
export const JUMP_FORCE    = 360   // pixels/s
export const MOVE_SPEED    = 90    // pixels/s (maps to PICO-8 v_x_max 2.5 × 8px/tile × 30fps ≈ 75, rounded up)
export const TILE_SIZE     = 8
export const DISPLAY_SCALE = 4     // 4× upscale: 128px world → 512px canvas
```

PICO-8 ran at 30fps with pixel-unit physics. Kaplay uses pixels/second. Conversion: `pico_val × TILE_SIZE × 30`.

## Gravity

Set globally before loading the game scene:
```typescript
k.setGravity(GRAVITY)
```

## Movement & Input

```typescript
// in game.ts onUpdate
if (k.isKeyDown("left"))  { player.move(-MOVE_SPEED, 0) }
if (k.isKeyDown("right")) { player.move(MOVE_SPEED, 0) }
if (k.isKeyPressed("space") && player.isGrounded()) { player.jump() }
```

Kaplay's `body()` applies friction automatically when grounded. No manual `apply_fric` needed.

## Animation

Define sprite animations in `loadSpriteAtlas()` using the `anims` map:

```typescript
"char1_idle": { x:8,  y:0, w:8, h:8 },
"char1_run":  { x:16, y:0, w:8, h:8 },
// ...
```

Use Kaplay's frame-based `sprite().play()` for the run animation (2 frames, loop), and `sprite().play("char1_idle")` when velocity is near zero.

Alternatively, use a single `loadSprite` per character with `{ frames: [...], anims: { idle, run } }` — cleaner once we know the exact frame layout.

## Character Selection

```typescript
let currentChar = 0
const chars = ["char1", "char2", "char3", "char4", "char5", "char6"]

k.onKeyPress("x", () => {
  currentChar = (currentChar + 1) % chars.length
  player.use(k.sprite("spritesheet", { anim: `${chars[currentChar]}_idle` }))
})
```

## Temporary Floor

Until level-01 is merged, add a static floor body at the bottom of the canvas:
```typescript
k.add([k.rect(k.width(), 16), k.pos(0, k.height() - 16), k.area(), k.body({ isStatic: true })])
```
