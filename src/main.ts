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
// Character (sprite row 0, sprites 1-5, single character since wall-jump port):
//   frames 0,1 = run   frame 2 = stand   frame 3 = jump   frame 4 = wall-slide
//
// Tiles (sprite row 7, at y=56):
//   tile_block: sprite 112   tile_wall: sprite 113
k.loadSpriteAtlas("sprites/spritesheet.png", {
  char1:      { x: 8,  y: 0,  width: 40, height: 8, sliceX: 5, anims: {
    run:       { from: 0, to: 1, loop: true, speed: 8 },
    stand:     2,
    jump:      3,
    wallslide: 4,
  } },
  tile_block: { x: 0,  y: 56, width: 8,  height: 8 },
  tile_wall:  { x: 8,  y: 56, width: 8,  height: 8 },
});

registerProofScene(k);
registerGameScene(k);
k.go("game");
