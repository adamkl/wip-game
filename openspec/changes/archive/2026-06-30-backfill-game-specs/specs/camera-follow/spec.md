## ADDED Requirements

### Requirement: Camera tracks the player centre each frame
Each frame the camera SHALL be repositioned so its centre targets the centre of the player sprite (player position + half the scaled sprite size).

#### Scenario: Camera updates every frame
- **WHEN** the game update loop runs
- **THEN** the camera target is recalculated from the current player position

### Requirement: Camera is clamped to map bounds
When the map is larger than the canvas on a given axis, the camera SHALL be clamped so it never shows area outside the map. The camera centre SHALL not move below `halfCanvas` or above `mapSize − halfCanvas` on that axis.

#### Scenario: Player near left edge
- **WHEN** the player moves near the left boundary
- **THEN** the camera x does not go below `k.width() / 2`

#### Scenario: Player near right edge
- **WHEN** the player moves near the right boundary
- **THEN** the camera x does not exceed `mapWidth − k.width() / 2`

#### Scenario: Player near top edge
- **WHEN** the player moves near the top boundary
- **THEN** the camera y does not go below `k.height() / 2`

#### Scenario: Player near bottom edge
- **WHEN** the player moves near the bottom boundary
- **THEN** the camera y does not exceed `mapHeight − k.height() / 2`

### Requirement: Camera centres on axes where the map fits the canvas
When a map dimension is less than or equal to the canvas size on that axis, the camera SHALL be fixed at the midpoint of the map on that axis rather than tracking the player.

#### Scenario: Map fits horizontally
- **WHEN** `mapWidth <= k.width()`
- **THEN** camera x is always `mapWidth / 2` regardless of player position

#### Scenario: Map fits vertically
- **WHEN** `mapHeight <= k.height()`
- **THEN** camera y is always `mapHeight / 2` regardless of player position
