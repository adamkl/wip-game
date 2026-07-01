## MODIFIED Requirements

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
