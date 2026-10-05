import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // Project pages are served from /MOVIE-RAJA/ rather than the domain root.
  // Keep local development at / while giving the Pages build the right asset base.
  base: process.env.GITHUB_PAGES === "true" ? "/MOVIE-RAJA/" : "/",
  server: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app"],
  },
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
