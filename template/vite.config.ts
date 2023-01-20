import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    server: true,
    port: 3000,
  },
  plugins: [react()],
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
