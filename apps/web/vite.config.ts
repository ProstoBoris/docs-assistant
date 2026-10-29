import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api requests to the NestJS dev server, so the browser
    // talks to a single origin and no CORS setup is needed.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
