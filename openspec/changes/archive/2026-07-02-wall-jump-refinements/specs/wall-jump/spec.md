## MODIFIED Requirements

### Requirement: Wall contact is tracked independently of ground contact
The player SHALL track an `on_wall` state, recomputed every frame as true only while both: (a) the player's collision area overlaps a solid tile on its left or right side, and (b) the player is actively holding the directional input toward that side. `on_wall` becomes false the instant either condition stops holding — including when the player releases the directional key while still physically touching the wall. This is independent of `on_ground` — a player can be grounded, wall-touching, both, or neither.

#### Scenario: Touching a wall while actively pressing into it
- **WHEN** the player's side collides with a solid tile while airborne and the player is holding the direction key toward that wall
- **THEN** `on_wall` becomes true

#### Scenario: Releasing the direction key while still touching the wall
- **WHEN** the player is touching a wall and `on_wall` is true, and the player releases the directional key toward that wall (with no opposite key held)
- **THEN** `on_wall` becomes false immediately, even though the player has not physically separated from the wall

#### Scenario: Leaving wall contact
- **WHEN** the player is no longer overlapping the wall on that side
- **THEN** `on_wall` becomes false immediately

#### Scenario: Pressing away from a wall while still touching it
- **WHEN** the player is touching a wall on one side and holds the directional key toward the opposite side
- **THEN** `on_wall` is false (or becomes false), since input is not directed toward the touching side
