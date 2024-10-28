import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:9367/",
        target: "http://localhost:9238/",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "~components": path.resolve(__dirname, "./src/components"),
      "~compositions": path.resolve(__dirname, "./src/compositions"),
      "~assets": path.resolve(__dirname, "./src/assets"),
      "~views": path.resolve(__dirname, "./src/views"),
    },
  },
});
