# Tasks

## Setup

- [ ] Create `package.json` with `kaplay`, `vite`, `typescript`, `tsx`, and `pngjs` (+ `@types/pngjs`)
- [ ] Create `tsconfig.json` with strict mode, `moduleResolution: "bundler"`, target `ES2020`
- [ ] Create `vite.config.ts` (minimal — just set `server.open: true`)
- [ ] Create `index.html` referencing `src/main.ts`

## Sprite Extraction

- [ ] Create `scripts/extract-sprites.ts` — embed the raw `__gfx__` hex string from `wip.p8`, decode using PICO-8 palette, write `public/sprites/spritesheet.png` via `pngjs`
- [ ] Run `npm run extract-sprites` and verify the PNG is correct (128×128, transparent background, pixel art visible)
- [ ] Commit `public/sprites/spritesheet.png`

## Kaplay Wiring

- [ ] Create `src/main.ts` — call `kaplay()` with pixel-art settings, `loadSpriteAtlas()` with all named regions from design.md
- [ ] Create `src/scenes/proof.ts` — add a simple scene that places one character sprite and one tile sprite on screen
- [ ] Register and start the `proof` scene in `main.ts`

## Verify

- [ ] `npm run dev` opens browser, canvas renders, no console errors
- [ ] Both a character sprite and a tile sprite are visible on screen
- [ ] `npm run build` exits 0
