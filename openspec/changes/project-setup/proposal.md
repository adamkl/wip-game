## Why

The repository is empty. Before any game logic can be written we need a build pipeline, the Kaplay runtime wired up, and the PICO-8 source sprites available as a PNG sprite sheet that Kaplay can load.

## What Changes

- Initialize a Vite + TypeScript project at the repo root
- Add Kaplay as a runtime dependency
- Add a one-shot script (`scripts/extract-sprites.ts`) that reads `wip.p8`'s `__gfx__` hex data and writes `public/sprites/spritesheet.png`
- Wire up `loadSpriteAtlas()` in `src/main.ts` with named regions for each character and tile sprite
- Render a static "proof of life" scene that shows the sprite sheet loaded correctly — no gameplay yet

## Capabilities

### New Capabilities

- `scaffold`: Vite + TypeScript project structure, Kaplay initialisation, dev/build scripts
- `sprite-extraction`: Script that converts PICO-8 `__gfx__` hex data to a PNG sprite sheet with correct palette and transparency

### Modified Capabilities

_(none — green-field)_

## Impact

- Adds `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Adds runtime dependency: `kaplay`
- Adds dev dependencies: `vite`, `typescript`, `pngjs` (for sprite extraction)
- Sprite sheet committed to `public/sprites/spritesheet.png` (generated artifact, checked in for reproducibility)
