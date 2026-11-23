import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { vexflow: ['vexflow/bravura'], tone: ['tone'], vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'] },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Mousik — Learn to compose',
        short_name: 'Mousik',
        description: 'Music theory and composition, from zero to your first piece.',
        theme_color: '#14161f',
        background_color: '#faf7f2',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,woff2}'], maximumFileSizeToCacheInBytes: 4_000_000 },
    }),
  ],
})
