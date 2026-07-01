import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
  },
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
})
