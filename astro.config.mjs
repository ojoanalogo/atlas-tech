import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap(), tailwind()],
  site: "https://ojoanalogo.github.io",
  compressHTML: true,
});
