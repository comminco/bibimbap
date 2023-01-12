import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
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
