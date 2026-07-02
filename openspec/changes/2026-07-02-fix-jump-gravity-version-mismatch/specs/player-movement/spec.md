## MODIFIED Requirements

### Requirement: Jump
The player SHALL jump when space or Z is pressed while grounded, receiving an upward velocity of JUMP_FORCE (540 wu/s). Mid-air jump presses are ignored unless the wall-jump condition applies (see the `wall-jump` capability). GRAVITY (1800 wu/s²) is the literal 30fps conversion of the source's `world.g=0.5` — no empirical correction is needed once JUMP_FORCE is derived from the correct source revision.

#### Scenario: Jump while grounded
- **WHEN** space or Z is pressed and the player is grounded
- **THEN** player receives upward velocity equal to JUMP_FORCE

#### Scenario: No mid-air jump off the ground condition
- **WHEN** space or Z is pressed, the player is not grounded, and the wall-jump condition does not apply
- **THEN** no additional velocity is applied

#### Scenario: Jump peak height matches the original
- **WHEN** the player jumps from a grounded, unobstructed position
- **THEN** the peak height reached is approximately 75 world units above the starting position (simulated against Kaplay's actual discrete 50Hz physics tick with JUMP_FORCE=540 and GRAVITY=1800), matching the original PICO-8 cart's measured ~71 world-unit jump height within normal frame-timing variance
