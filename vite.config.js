import { defineConfig } from 'vite';
import { globSync } from 'glob'; // Используем globSync для версии 11
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src', // Указываем, что исходники в папке src
    build: {
      sourcemap: true,
      rollupOptions: {
        // Ищем файлы в папке src, но передаем только их имена
        input: globSync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: '../dist', // Сборка будет в папке dist в корне проекта
      emptyOutDir: true,
    },
    // Правильное место для плагинов PostCSS
    css: {
      postcss: {
        plugins: [
          SortCss({
            sort: 'mobile-first',
          }),
        ],
      },
    },
    // Только плагины Vite
    plugins: [
      injectHTML(),
      FullReload(['./src/**/**.html']),
    ],
  };
});