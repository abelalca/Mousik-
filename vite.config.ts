import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig(({ mode }) => ({
  // 'preview' mode: static build with relative paths, hash routing and no service worker.
  base: mode === 'preview' ? './' : '/',
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
    mode !== 'preview' &&
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
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,json}'],
        maximumFileSizeToCacheInBytes: 4_000_000,
        // Instrument samples are cached the first time they are played (works offline afterwards).
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/samples/'),
            handler: 'CacheFirst',
            options: { cacheName: 'mousik-samples', expiration: { maxEntries: 300 } },
          },
        ],
      },
    }),
  ],
}))
