import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons/*.png', 'screenshots/*.png'],
      manifest: {
        name: 'Positive Mind',
        short_name: 'Positive Mind',
        description: 'Train your mind. Change your perspective. Build a future you\u2019ll appreciate.',
        id: base,
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F7F6F1',
        theme_color: '#718775',
        lang: 'en',
        categories: ['lifestyle', 'health', 'education'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          { src: 'screenshots/pm-narrow.png', sizes: '390x844', type: 'image/png', form_factor: 'narrow', label: 'Positive Mind on a phone' },
          { src: 'screenshots/pm-wide.png', sizes: '1280x800', type: 'image/png', form_factor: 'wide', label: 'Positive Mind on desktop' },
        ],
        shortcuts: [
          { name: 'Perspective Shift', short_name: 'Perspective Shift', url: `${base}#/shift`, icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Evening reflection', short_name: 'Evening reflection', url: `${base}#/evening`, icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest,xml,txt}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
})
