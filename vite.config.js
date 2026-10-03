import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      // Registered by hand in src/lib/app-updates.js so it can poll for updates.
      injectRegister: false,
      workbox: {
        // The plugin only implies these for injectRegister 'auto'/null (dist/index.js, the
        // `workbox.skipWaiting = true` branch); with false they must be explicit or a new worker
        // waits forever and the page never reloads onto it.
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff2}'],
      },
      manifest: {
        name: "AJ's Code Visualizer",
        short_name: 'Code Visualizer',
        description: 'Learn coding ideas one step at a time, with pictures.',
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#0b4fb3',
        background_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  // Relative base so the build works from a GitHub Pages sub-path.
  base: './',
});
