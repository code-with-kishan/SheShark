import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'production' ? false : true,
      target: 'esnext',
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return;
            }

            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router-dom/')) {
              return 'react-vendor';
            }

            if (id.includes('/firebase/') || id.includes('/@firebase/')) {
              return 'firebase';
            }

            if (id.includes('/recharts/') || id.includes('/d3-') || id.includes('/victory-vendor/')) {
              return 'charts';
            }

            if (id.includes('/jspdf/')) {
              return 'pdf';
            }

            if (id.includes('/html2canvas/') || id.includes('/canvg/')) {
              return 'capture';
            }

            if (id.includes('/three/')) {
              return 'three';
            }

            if (id.includes('/motion/') || id.includes('/framer-motion/') || id.includes('/gsap/')) {
              return 'animation';
            }

            if (
              id.includes('/react-markdown/') ||
              id.includes('/remark-') ||
              id.includes('/rehype-') ||
              id.includes('/micromark') ||
              id.includes('/mdast-') ||
              id.includes('/hast-') ||
              id.includes('/unist-') ||
              id.includes('/vfile')
            ) {
              return 'markdown';
            }

            if (id.includes('/lucide-react/')) {
              return 'icons';
            }

            if (id.includes('/zustand/') || id.includes('/axios/') || id.includes('/tailwind-merge/') || id.includes('/clsx/')) {
              return 'app-vendor';
            }

            return;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
 
