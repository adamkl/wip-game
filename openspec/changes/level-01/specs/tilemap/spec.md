# Tilemap

## Requirements

- The level geometry matches the PICO-8 source layout (16×14 tile area, walls and platforms as documented in design.md)
- Tile collision is data-driven: solid tiles are marked in the Tiled file, not hardcoded in game logic
- The player cannot pass through any solid tile
- The camera follows the player
- The camera does not show area outside the map bounds
- The temporary floor added in `player-movement` is removed
- The tilemap pipeline (`.tmj` file → Kaplay load → rendered level) works without manual tile-index mapping in game code, establishing the pattern for future levels
