import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,        // 🚨 "0.0.0.0" 보다 이게 더 강력 — 외부 전체 허용
    port: 5173,
    strictPort: true,
    cors: true,        // CORS도 허용
    proxy: {
      "/api": {
        target: "https://nonidiomatical-laurice-muscularly.ngrok-free.dev",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
