import kaplay from "kaplay";
import { registerGameScene } from "./scenes/game";
import { registerProofScene } from "./scenes/proof";

const k = kaplay({
  width: 512,
  height: 512,
  letterbox: true,
  crisp: true,
  background: [0, 0, 0],
  debug: true,
});

// Prefix all asset loads with Vite's base path so they resolve correctly
// whether the app is served from / (dev) or /wip-game/ (GitHub Pages).
k.loadRoot(import.meta.env.BASE_URL);

// Sprite sheet is 128×128; each sprite is 8×8 px at indices on a 16-column grid.
// Sprite n → x = (n % 16) * 8, y = floor(n / 16) * 8
//
// Characters (sprite row 0, all at y=0):
//   char1: sprites 1-2    char4: sprites 5-6
//   char2: sprite  3      char5: sprites 7-8
//   char3: sprite  4      char6: sprites 9-10
//
// Tiles (sprite row 7, at y=56):
//   tile_block: sprite 112   tile_wall: sprite 113
k.loadSpriteAtlas("sprites/spritesheet.png", {
  char1:      { x: 8,  y: 0,  width: 16, height: 8, sliceX: 2, anims: { idle: 0, run: { from: 0, to: 1, loop: true, speed: 8 } } },
  char2:      { x: 24, y: 0,  width: 8,  height: 8 },
  char3:      { x: 32, y: 0,  width: 8,  height: 8 },
  char4:      { x: 40, y: 0,  width: 16, height: 8, sliceX: 2, anims: { idle: 0, run: { from: 0, to: 1, loop: true, speed: 8 } } },
  char5:      { x: 56, y: 0,  width: 16, height: 8, sliceX: 2, anims: { idle: 0, run: { from: 0, to: 1, loop: true, speed: 8 } } },
  char6:      { x: 72, y: 0,  width: 16, height: 8, sliceX: 2, anims: { idle: 0, run: { from: 0, to: 1, loop: true, speed: 8 } } },
  tile_block: { x: 0,  y: 56, width: 8,  height: 8 },
  tile_wall:  { x: 8,  y: 56, width: 8,  height: 8 },
});

k.loadJSON("level-01-map", "maps/level-01.tmj");
k.loadJSON("level-01-tileset", "maps/tileset.tsj");

registerProofScene(k);
registerGameScene(k);
k.go("game");
