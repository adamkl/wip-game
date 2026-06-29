# Tasks

## Config

- [ ] Create `src/config.ts` with `GRAVITY`, `JUMP_FORCE`, `MOVE_SPEED`, `TILE_SIZE`, `DISPLAY_SCALE` constants (values from design.md)

## Player Entity

- [ ] Create `src/entities/player.ts` with `spawnPlayer(k, pos)` — compose `sprite`, `pos`, `area`, `body`, `anchor` components
- [ ] Set the collision area to a 6×6 inset rect (matching original bbox offset)
- [ ] Export a `CharacterIndex` type and accept it as a parameter so the scene can pass the initial character

## Game Scene

- [ ] Create `src/scenes/game.ts` — register a `"game"` scene
- [ ] Call `k.setGravity(GRAVITY)` at scene start
- [ ] Spawn player at centre of screen
- [ ] Add a temporary static floor (full-width rect at screen bottom)
- [ ] Update `src/main.ts` to start `"game"` instead of `"proof"`

## Input & Movement

- [ ] Left/right movement in `onUpdate` using `player.move()`
- [ ] Jump on Space/Z when `player.isGrounded()`
- [ ] Flip sprite based on last horizontal direction

## Animation

- [ ] Define idle and run animations in `loadSpriteAtlas()` for all 6 characters (see sprite atlas layout in project-setup design.md)
- [ ] Play run animation when `|vx| > threshold`, idle otherwise
- [ ] Switch animation immediately on character change

## Character Selection

- [ ] On X key press, cycle `currentChar` and swap the sprite animation

## Verify

- [ ] Player spawns and falls onto the floor
- [ ] Left/right/jump controls feel responsive
- [ ] Sprite flips direction correctly
- [ ] Animation switches between idle and run
- [ ] X key cycles through all 6 visual characters
