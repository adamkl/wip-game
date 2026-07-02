## Why

Playtesting the newly-ported wall-jump feature surfaced two mismatches with the original `feat/wall_jump` PICO-8 branch: (1) wall-riding never disengages once contact is made, even after releasing the direction key, removing the skill/timing the original requires; (2) the player visibly floats ~1 pixel away from any wall it's flush against. Both trace back to how the port's collision model differs from the source's per-frame swept-raycast approach, and are fixable without abandoning Kaplay's built-in physics.

## What Changes

- Wall contact (`on_wall`) is no longer a sticky flag cleared only by `onCollideEnd`. It's recomputed every `onUpdate` tick as a pure function of current collision state **and** current directional input — true only while the player is both touching a wall on a side **and** actively holding the key toward that side. Releasing the key (or holding away) clears it immediately, matching the original: sliding down a wall in the source only "sees" the wall via a raycast swept along current velocity, so it stops detecting contact the instant horizontal velocity (and thus directional input) stops pointing into the wall.
- Add an inset collision shape to the player's `area()`, matching the original Lua `bbox`'s collision points (roughly 1–2px inset from each of the sprite's four edges, not the full 8×8 box). This closes the visible gap between the player sprite and any wall/floor/ceiling it's resting against, since the collision boundary will land where the sprite's actual (non-transparent) art is, rather than at the edge of its transparent-padded bounding frame.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `wall-jump`: the "Wall contact is tracked independently of ground contact" requirement changes — `on_wall` additionally requires active directional input toward the wall, not just physical overlap. Wall-slide and wall-jump requirements that depend on `on_wall` inherit this behavior change.
- `player-movement`: the player's collision `area()` shape changes from the full sprite bounds to an inset box matching the original's bbox collision points, affecting how precisely the player can approach walls, floors, and ceilings before physics registers contact.

## Impact

- `src/entities/player.ts`: replace the `onCollideUpdate`/`onCollideEnd`-based `onWall` tracking with a per-frame recomputation gated on input direction; add an inset `area()` shape
- `openspec/specs/wall-jump/spec.md`, `openspec/specs/player-movement/spec.md`: requirements updated at archive time
- No changes to `config.ts` constants or level data
