import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access when in docker
    proxy: {
      '/api': {
        target: 'http://backend-core:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://backend-core:8080',
        changeOrigin: true,
      },
    },
  },
})
