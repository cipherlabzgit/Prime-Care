import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [react(), tailwindcss()];

  if (command === "serve") {
    const { createSlotHoldsMiddleware } = await import("./server/slotHoldsStore.js");
    plugins.push({
      name: "premiercare-slot-holds",
      configureServer(server) {
        server.middlewares.use(createSlotHoldsMiddleware());
      },
    });
  }

  return {
    plugins,
    server: {
      proxy: {
        "/api/public/reviews": {
          target: "http://localhost:7001",
          changeOrigin: true,
        },
        "/api/public/landing-enquiry": {
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
        "/api/channeling/public/discover": {
          target: "http://localhost:7001",
          changeOrigin: true,
        },
        "/api/channeling/public/doctors": {
          target: "http://localhost:7001",
          changeOrigin: true,
        },
        "/api/channeling/public/specializations": {
          target: "http://localhost:7001",
          changeOrigin: true,
        },
        "/api/channeling/public/sessions": {
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
        "/api/channeling/holds": {
          target: "http://localhost:7001",
          changeOrigin: true,
        },
      },
    },
  };
});
