import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/basket-ball/", // replace with the repo name
  assetsInclude: ["**/*.gltf"],
  publicDir: "public",
  build: {
    outDir: "dist",
  },
});
