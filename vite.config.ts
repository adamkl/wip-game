import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages serves from /wip-game/; local dev uses root.
  base: process.env.GITHUB_ACTIONS ? "/wip-game/" : "/",
  server: { open: true },
});
