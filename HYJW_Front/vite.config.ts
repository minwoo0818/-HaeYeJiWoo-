import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "172.20.20.10",
    port: 80,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://172.20.20.10:8080",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
    },
  },
});

