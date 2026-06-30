## ADDED Requirements

### Requirement: Load map and tileset from bundled JSON
The level loader SHALL accept a pre-parsed Tiled map object (`TiledMap`) and a tileset object (`TiledTileset`) rather than fetching them at runtime. Both are bundled into the JS module at build time via ES module imports.

#### Scenario: Level data is available synchronously
- **WHEN** the game scene starts
- **THEN** map and tileset data are immediately available without any async fetch

### Requirement: Spawn solid tile objects from the tile layer
The loader SHALL iterate the first tile layer in the map, skip empty cells (GID 0), and for each solid tile spawn a static game object with a sprite, area collider, and static body at the correct world position.

#### Scenario: Solid tile is spawned
- **WHEN** a tile layer cell contains a GID whose corresponding tileset entry has `solid: true`
- **THEN** a game object is created at `(col × TILE_SIZE, row × TILE_SIZE)` with `k.body({ isStatic: true })`

#### Scenario: Empty cell is skipped
- **WHEN** a tile layer cell contains GID 0
- **THEN** no game object is created for that cell

#### Scenario: Non-solid tile is skipped
- **WHEN** a tile layer cell contains a GID whose tileset entry does not have `solid: true`
- **THEN** no game object is created for that cell

### Requirement: Return map dimensions in world units
`spawnTiledLevel` SHALL return `{ mapWidth, mapHeight }` where each dimension equals the tile count on that axis multiplied by `TILE_SIZE` (32 world units per tile).

#### Scenario: Correct world dimensions returned
- **WHEN** the map is 16 tiles wide and 14 tiles tall
- **THEN** `mapWidth` is 512 and `mapHeight` is 448
