import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

const pathToPackages = resolve(__dirname, "..", "packages");
const resolvePackage = (name: string) => resolve(pathToPackages, name, "src");

export const viteConfig = defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      "@solid-aria/list": resolvePackage("list"),
      "@solid-aria/collection": resolvePackage("collection")
    }
  },
  build: {
    target: "esnext",
    polyfillDynamicImport: false
  }
});
