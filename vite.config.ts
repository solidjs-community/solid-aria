import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export const viteConfig = defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false
  }
});
