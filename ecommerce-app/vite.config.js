import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://127.0.0.1:5000',
      '/callback': 'http://127.0.0.1:5000',
      '/logout': 'http://127.0.0.1:5000',
      '/profile': 'http://127.0.0.1:5000',
      '/api': 'http://127.0.0.1:5000',
    }
  }
})
