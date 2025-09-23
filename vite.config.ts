import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5181,
    proxy: {
      // Forward any /api requests to the backend server and keep the /api prefix
      // so backend routes mounted at /api/* still match.
      '/api': {
        target: 'http://localhost:4101',
        changeOrigin: true,
        // Do not rewrite — keep the full path so /api/plans -> http://localhost:4101/api/plans
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    fs: {
      allow: [".", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));
