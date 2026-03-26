import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window"
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ['pseudohexagonal-conclusionally-saul.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  }
})