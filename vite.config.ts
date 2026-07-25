import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), visualizer({open: false, gzipSize: true, brotliSize: true, filename: 'stats.json', json: true})],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/') || id.includes('node_modules/react-router/')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'icons';
            }
            if (id.includes('node_modules/motion/')) {
              return 'motion';
            }
          },
        },
      },
    },
  };
});
