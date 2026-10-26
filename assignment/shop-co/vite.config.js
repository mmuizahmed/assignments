import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/assignment/shop-co/",
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
});
