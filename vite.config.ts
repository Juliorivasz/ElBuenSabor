import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    https: true,
    proxy: {
      // Proxy para la API REST
      '/pedido': {
        target: 'https://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy para WebSocket (si lo usás desde el front)
      '/ws-chat': {
        target: 'wss://localhost:8080',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss(), mkcert()],
  define: {
    global: "window",
  },
});
