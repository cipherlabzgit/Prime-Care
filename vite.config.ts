import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/public/reviews": {
        target: "http://localhost:7001",
        changeOrigin: true,
      },
      "/api/channeling/reviews": {
        target: "http://localhost:7001",
        changeOrigin: true,
      },
      "/api/channeling/rmo": {
        target: "http://localhost:7001",
        changeOrigin: true,
      },
      "/api/channeling/reception": {
        target: "http://localhost:7001",
        changeOrigin: true,
      },
    },
  },
})
