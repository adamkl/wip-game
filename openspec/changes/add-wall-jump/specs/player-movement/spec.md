## MODIFIED Requirements

### Requirement: Horizontal movement via keyboard
The player SHALL move horizontally in response to arrow keys (left/right) or WASD (a/d).
Velocity increases by MOVE_ACCEL (1440 wu/s²) each frame while the key is held, capped at MOVE_SPEED (300 wu/s) in either direction.

#### Scenario: Player accelerates right
- **WHEN** the right arrow or D key is held
- **THEN** player velocity increases rightward each frame up to MOVE_SPEED

#### Scenario: Player accelerates left
- **WHEN** the left arrow or A key is held
- **THEN** player velocity increases leftward each frame up to MOVE_SPEED

### Requirement: Ground friction decelerates the player
MOVE_FRICTION (540 wu/s²) SHALL be applied to decelerate the player whenever no horizontal input is active, whether grounded or airborne. Velocity snaps to zero when it falls below the per-frame friction amount.

#### Scenario: Player decelerates after releasing key while grounded
- **WHEN** no horizontal key is held and the player is grounded
- **THEN** player velocity reduces by MOVE_FRICTION × dt each frame until it reaches zero

#### Scenario: Player decelerates after releasing key while airborne
- **WHEN** no horizontal key is held and the player is airborne
- **THEN** player velocity reduces by MOVE_FRICTION × dt each frame until it reaches zero, same as when grounded

#### Scenario: Velocity snaps to zero
- **WHEN** remaining velocity is less than or equal to the friction delta for that frame
- **THEN** velocity is set to exactly zero (no oscillation)

### Requirement: Jump
The player SHALL jump when space or Z is pressed while grounded, receiving an upward velocity of JUMP_FORCE (540 wu/s). Mid-air jump presses are ignored unless the wall-jump condition applies (see the `wall-jump` capability). GRAVITY (3300 wu/s²) is unchanged from prior tuning.

#### Scenario: Jump while grounded
- **WHEN** space or Z is pressed and the player is grounded
- **THEN** player receives upward velocity equal to JUMP_FORCE

#### Scenario: No mid-air jump off the ground condition
- **WHEN** space or Z is pressed, the player is not grounded, and the wall-jump condition does not apply
- **THEN** no additional velocity is applied

#### Scenario: Jump peak height matches the original
- **WHEN** the player jumps from a grounded, unobstructed position
- **THEN** the peak height reached is approximately 39 world units above the starting position (peak height scales with JUMP_FORCE², not linearly — simulated against Kaplay's actual discrete 50Hz physics tick with JUMP_FORCE=540 and GRAVITY=3300, within normal frame-timing variance)

### Requirement: Sprite faces direction of travel
The player sprite SHALL be horizontally mirrored (flipX) to face in the direction the player is moving. The default sprite faces left, so flipX is set to true when moving right.

#### Scenario: Facing right
- **WHEN** the player is moving right (positive velocity)
- **THEN** player.flipX is true

#### Scenario: Facing left
- **WHEN** the player is moving left (negative velocity)
- **THEN** player.flipX is false

### Requirement: Animation reflects physics state
The player SHALL play one of four animation states based on current physics state, in priority order: wall-slide (on_wall and falling) takes priority over airborne (jump), which takes priority over grounded states. While grounded, the player shows a run animation if moving horizontally, or a stand (idle) animation if still.

#### Scenario: Grounded and moving
- **WHEN** the player is grounded and horizontal velocity is nonzero
- **THEN** the run animation plays

#### Scenario: Grounded and still
- **WHEN** the player is grounded and horizontal velocity is zero
- **THEN** the stand animation plays

#### Scenario: Airborne, not wall-sliding
- **WHEN** the player is not grounded and not wall-sliding
- **THEN** the jump animation plays

#### Scenario: Wall-sliding
- **WHEN** the player is touching a wall and falling
- **THEN** the wall-slide animation plays, even if also technically airborne
