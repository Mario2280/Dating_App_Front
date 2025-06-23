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
      ".ngrok.io", // Если используете ngrok
      ".tuna.am" // Все поддомены tuna.am
    ],
  },
  define: {
    global: "globalThis",
  },
})
