## Why

With the scaffold in place the next step is the core gameplay loop: a player character that moves, jumps, and animates using Kaplay's built-in physics and component model. This is the foundation every future feature builds on.

## What Changes

- Add `src/entities/player.ts` defining the player game object with Kaplay components
- Add `src/config.ts` for tunable game constants (speed, jump force, gravity)
- Replace the `proof` scene with a `game` scene that spawns the player in open space
- Implement left/right movement, jumping, friction, and gravity via Kaplay's `body()` and `area()` components
- Implement 6-character selection cycling (X key), preserving the PICO-8 original behaviour
- Implement sprite animation: cycle frames when moving, hold frame when idle

## Capabilities

### New Capabilities

- `player-controller`: Player entity definition, movement, jump, friction, gravity, animation, character selection

### Modified Capabilities

_(none)_

## Impact

- Depends on `project-setup` (sprite atlas must be loaded)
- Adds `src/entities/player.ts`, `src/config.ts`, `src/scenes/game.ts`
- Replaces `src/scenes/proof.ts` with `src/scenes/game.ts`
- No level geometry yet — player falls to a temporary flat floor
