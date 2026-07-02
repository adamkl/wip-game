# wall-jump Specification

## Purpose
Defines wall contact tracking and the wall-slide/wall-jump mechanics it enables: reduced fall speed while pressed against a wall, and a directional launch off the wall on jump input.
## Requirements
### Requirement: Wall contact is tracked independently of ground contact
The player SHALL track an `on_wall` state, set true while the player's collision area overlaps a solid tile on its left or right side, and cleared the instant that contact ends. This is independent of `on_ground` — a player can be grounded, wall-touching, both, or neither.

#### Scenario: Touching a wall while airborne
- **WHEN** the player's side collides with a solid tile while airborne
- **THEN** `on_wall` becomes true

#### Scenario: Leaving wall contact
- **WHEN** the player is no longer overlapping the wall on that side
- **THEN** `on_wall` becomes false immediately

### Requirement: Wall-slide reduces fall speed while pressed against a wall
While `on_wall` is true and the player is falling (`vel.y > 0`), gravity SHALL be scaled to WALL_SLIDE_GRAVITY_MULT (0.2×) of normal, producing a slow slide down the wall face instead of a free fall. Gravity returns to normal (1×) the instant either condition is no longer true.

#### Scenario: Sliding down a wall
- **WHEN** the player is touching a wall and falling
- **THEN** effective gravity is 20% of GRAVITY for that duration

#### Scenario: Wall contact lost mid-slide
- **WHEN** `on_wall` becomes false while wall-sliding
- **THEN** gravity immediately returns to full strength

#### Scenario: Rising while touching a wall
- **WHEN** the player is touching a wall but moving upward (e.g. mid-jump arc)
- **THEN** gravity is not reduced (full strength applies)

### Requirement: Wall-jump launches the player up and away from the wall
Pressing the jump key while `on_wall` is true and the player is falling SHALL set vertical velocity to WALL_JUMP_FORCE (75% of JUMP_FORCE) upward and horizontal velocity to full MOVE_SPEED in the direction opposite the player's last-faced direction — away from the wall being pushed off. This takes priority over the ground-jump trigger condition when both could apply.

#### Scenario: Jump while wall-sliding
- **WHEN** the jump key is pressed while `on_wall` is true and the player is falling
- **THEN** vertical velocity becomes -WALL_JUMP_FORCE and horizontal velocity becomes ±MOVE_SPEED away from the last-faced direction

#### Scenario: Wall-jump kicks away from the last-faced direction
- **WHEN** the player was last facing right (e.g. pressed into a wall on their right) and wall-jumps
- **THEN** horizontal velocity is set to -MOVE_SPEED (leftward, away from that wall)

#### Scenario: No wall-jump when touching a wall but not falling
- **WHEN** the jump key is pressed while `on_wall` is true but the player is not falling (e.g. rising or still)
- **THEN** no wall-jump velocity is applied (ground-jump rules apply instead, if grounded)

### Requirement: Wall-slide animation plays while sliding
The player SHALL play a distinct wall-slide animation frame whenever `on_wall` is true and the player is falling, taking priority over the default airborne (jump) frame.

#### Scenario: Entering wall-slide
- **WHEN** the player becomes wall-sliding (on_wall true, falling)
- **THEN** the wall-slide sprite frame is shown

#### Scenario: Leaving wall-slide for airborne
- **WHEN** the player is airborne but not wall-sliding (e.g. after a wall-jump, moving away from the wall)
- **THEN** the jump/airborne sprite frame is shown instead

