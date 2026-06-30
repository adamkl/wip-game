## Why

The game is now in a working state with player movement, jumping, a tiled cave level, a following camera, and mobile touch controls — but no specs exist to describe any of this behaviour. Backfilling specs gives us a shared baseline so future changes have a clear contract to evolve against.

## What Changes

- Add specs covering all currently-implemented capabilities:
  - Player movement (run, friction, jump)
  - Character cycling
  - Touch controls (mobile on-screen buttons)
  - Tiled level loading
  - Camera follow with map-bounds clamping

## Capabilities

### New Capabilities

- `player-movement`: Horizontal acceleration, top speed, ground friction, jump; flipX mirrors sprite to face direction of travel.
- `character-cycling`: Player can cycle through 6 characters (X key); animated characters play run/idle animations.
- `touch-controls`: On-screen left/right/jump buttons shown only on touch-primary devices; disables double-tap zoom.
- `tiled-level`: Loads a Tiled JSON map and tileset, spawns solid tile objects at correct world positions.
- `camera-follow`: Camera tracks the player's centre, clamped to map bounds; centres on axes where the map fits inside the canvas.

### Modified Capabilities

## Impact

- `openspec/specs/` — five new spec files created
- No production code changes
