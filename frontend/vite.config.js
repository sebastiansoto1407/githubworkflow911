import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/categorias": "http://127.0.0.1:8005",
      "/productos": "http://127.0.0.1:8005",
    },
  },
});
