import type kaplay from "kaplay";
import { DISPLAY_SCALE } from "../config";
import { spawnPlayer } from "../entities/player";
import { spawnTiledLevel, type TiledMap, type TiledTileset } from "../level/tiled-loader";
import level01MapJson from "../maps/level-01.json";
import tilesetJson from "../maps/tileset.json";

type K = ReturnType<typeof kaplay>;

const mapData = level01MapJson as unknown as TiledMap;
const tilesetData = tilesetJson as unknown as TiledTileset;

export function registerGameScene(k: K) {
  k.scene("game", () => {
    k.setGravity(1800);

    const { mapWidth, mapHeight } = spawnTiledLevel(k, mapData, tilesetData);

    // Spawn player in the open upper-left area of the cave.
    const player = spawnPlayer(k, 64 * DISPLAY_SCALE, 64 * DISPLAY_SCALE);

    // Camera follows player, clamped to map bounds.
    // When a map dimension fits inside the canvas, centre on that axis.
    k.onUpdate(() => {
      const hw = k.width()  / 2;
      const hh = k.height() / 2;
      const playerCx = player.pos.x + (8 * DISPLAY_SCALE) / 2;
      const playerCy = player.pos.y + (8 * DISPLAY_SCALE) / 2;
      const cx = mapWidth  > k.width()  ? k.clamp(playerCx, hw, mapWidth  - hw) : mapWidth  / 2;
      const cy = mapHeight > k.height() ? k.clamp(playerCy, hh, mapHeight - hh) : mapHeight / 2;
      k.camPos(cx, cy);
    });
  });
}
