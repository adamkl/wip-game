import type kaplay from "kaplay";
import { DISPLAY_SCALE, GRAVITY, TILE_SIZE } from "../config";
import { spawnPlayer } from "../entities/player";

type K = ReturnType<typeof kaplay>;

export function registerGameScene(k: K) {
  k.scene("game", () => {
    k.setGravity(GRAVITY);

    // Temporary floor — replaced by Tiled level geometry in feat/level-01.
    k.add([
      k.pos(0, k.height() - TILE_SIZE),
      k.rect(k.width(), TILE_SIZE),
      k.area(),
      k.body({ isStatic: true }),
      k.color(k.Color.fromHex("#ab5236")),
    ]);

    // Spawn player at PICO-8 origin (64, 64) scaled to world coords.
    const player = spawnPlayer(k, 64 * DISPLAY_SCALE, 64 * DISPLAY_SCALE);

    // Camera follows player (clamped to world bounds).
    k.onUpdate(() => {
      const hw = k.width()  / 2;
      const hh = k.height() / 2;
      const cx = k.clamp(player.pos.x + (8 * DISPLAY_SCALE) / 2, hw, k.width()  - hw);
      const cy = k.clamp(player.pos.y + (8 * DISPLAY_SCALE) / 2, hh, k.height() - hh);
      k.camPos(cx, cy);
    });
  });
}
