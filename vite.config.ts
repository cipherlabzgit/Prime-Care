import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createSlotHoldsMiddleware } from "./server/slotHoldsStore.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "premiercare-slot-holds",
      configureServer(server) {
        // Serve holds inside Vite so locking works with `npm run dev` alone.
        server.middlewares.use(createSlotHoldsMiddleware());
      },
    },
  ],
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
      "/api/channeling/public/bookings": {
        target: "http://localhost:7001",
        changeOrigin: true,
      },
      "/api/channeling/public/auth": {
        target: "http://localhost:7001",
        changeOrigin: true,
      },
    },
  },
});
