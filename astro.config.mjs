import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap()],
  site: "https://atlas-sinaloa.tech",
  compressHTML: true,
  trailingSlash: "never",
  vite: { plugins: [tailwindcss()] },
});
