import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],

  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "react-redux": path.resolve("./node_modules/react-redux"),
    },
  },

  server: {
    port: 5174,
    strictPort: true, // Optional: if 3000 is busy, Vite will throw an error instead of using another port
  },
});
