import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/wip-game/" : "/",
  server: { open: true },
});
