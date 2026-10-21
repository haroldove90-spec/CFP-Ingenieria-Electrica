import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'clean-stale-pwa-dev',
        resolveId(id: string) {
          if (id.includes('pwa-entry-point-loaded') || id.includes('virtual:pwa')) {
            return '\0' + id;
          }
        },
        load(id: string) {
          if (id.includes('pwa-entry-point-loaded') || id.includes('virtual:pwa')) {
            return 'export default function registerDevSW() {}; export const registerSW = () => () => {};';
          }
        },
      },
      ...(isBuild
        ? [
            VitePWA({
              injectRegister: null,
              registerType: 'autoUpdate',
              workbox: {
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
                runtimeCaching: [
                  {
                    urlPattern: ({ request }) => request.destination === 'document',
                    handler: 'NetworkFirst',
                    options: {
                      cacheName: 'documents',
                    },
                  },
                  {
                    urlPattern: ({ request }) =>
                      ['style', 'script', 'worker'].includes(request.destination),
                    handler: 'StaleWhileRevalidate',
                    options: {
                      cacheName: 'assets',
                    },
                  },
                  {
                    urlPattern: ({ request }) => request.destination === 'image',
                    handler: 'CacheFirst',
                    options: {
                      cacheName: 'images',
                      expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                      },
                    },
                  },
                ],
              },
              manifest: false,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
