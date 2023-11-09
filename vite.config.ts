import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       entryFileNames: `assets/[name].js`,
  //       chunkFileNames: `assets/[name]-[hash].js`,
  //       assetFileNames: `assets/[name].[ext]`,
  //     },
  //   }
  // }
});
