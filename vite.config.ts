// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy solo para /api/*
      '/api': {
        target: 'https://reqres.in',
        changeOrigin: true,
        secure: true,
        // NO quitamos /api → lo mantenemos para que llegue a /api/login
        rewrite: (path) => path  // ← cambio clave: no hacemos replace
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})