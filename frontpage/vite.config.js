import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    strictPort: true,
    allowedHosts: ['.up.railway.app'] // 允许所有 railway.app 域名
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    strictPort: true,
    allowedHosts: ['.up.railway.app']
  }
})