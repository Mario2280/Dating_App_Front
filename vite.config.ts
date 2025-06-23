import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".ngrok.io", 
      ".tuna.am", 
      ".me"
    ],
    proxy: {
      '/telegram-images': {
        target: 'https://t.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/telegram-images/, ''),
        secure: true 
      },

      // Для локального API (http://localhost:3001)
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    global: "globalThis",
  },
})
