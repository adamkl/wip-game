# player-movement Specification

## Purpose
Defines how the player character moves horizontally, decelerates, and jumps, including the sprite orientation rule that mirrors the character to face the direction of travel.
## Requirements
### Requirement: Horizontal movement via keyboard
The player SHALL move horizontally in response to arrow keys (left/right) or WASD (a/d).
Velocity increases by MOVE_ACCEL (1800 wu/s²) each frame while the key is held, capped at MOVE_SPEED (300 wu/s) in either direction.

#### Scenario: Player accelerates right
- **WHEN** the right arrow or D key is held
- **THEN** player velocity increases rightward each frame up to MOVE_SPEED

#### Scenario: Player accelerates left
- **WHEN** the left arrow or A key is held
- **THEN** player velocity increases leftward each frame up to MOVE_SPEED

### Requirement: Ground friction decelerates the player
When no horizontal input is active and the player is grounded, MOVE_FRICTION (540 wu/s²) SHALL be applied to decelerate the player. Velocity snaps to zero when it falls below the per-frame friction amount.

#### Scenario: Player decelerates after releasing key
- **WHEN** no horizontal key is held and the player is grounded
- **THEN** player velocity reduces by MOVE_FRICTION × dt each frame until it reaches zero

#### Scenario: Velocity snaps to zero
- **WHEN** remaining velocity is less than or equal to the friction delta for that frame
- **THEN** velocity is set to exactly zero (no oscillation)

### Requirement: Jump
The player SHALL jump when space or Z is pressed while grounded, receiving an upward velocity of JUMP_FORCE (720 wu/s). Mid-air jump presses are ignored. GRAVITY (3300 wu/s²) is tuned so the resulting jump arc peaks at approximately 71 world units, matching the original PICO-8 cart's measured on-screen jump height rather than a literal 30fps conversion of the source's per-frame constants.

#### Scenario: Jump while grounded
- **WHEN** space or Z is pressed and the player is grounded
- **THEN** player receives upward velocity equal to JUMP_FORCE

#### Scenario: No mid-air jump
- **WHEN** space or Z is pressed and the player is not grounded
- **THEN** no additional velocity is applied

#### Scenario: Jump peak height matches the original
- **WHEN** the player jumps from a grounded, unobstructed position
- **THEN** the peak height reached is approximately 71 world units above the starting position (within normal frame-timing variance)

### Requirement: Sprite faces direction of travel
The player sprite SHALL be horizontally mirrored (flipX) to face in the direction the player is moving. The default sprite faces left, so flipX is set to true when moving right.

#### Scenario: Facing right
- **WHEN** the player is moving right (positive velocity)
- **THEN** player.flipX is true

#### Scenario: Facing left
- **WHEN** the player is moving left (negative velocity)
- **THEN** player.flipX is false

