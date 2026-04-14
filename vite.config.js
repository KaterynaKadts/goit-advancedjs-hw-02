import { defineConfig } from 'vite';
import { globSync } from 'glob'; 
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';


export default defineConfig(({ command }) => {
  return {

    base: '/goit-advancedjs-hw-02/', 


    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src', 
    build: {
      sourcemap: true,
      rollupOptions: {
       
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
      outDir: '../dist',
      emptyOutDir: true,
    },
   
    css: {
      postcss: {
        plugins: [
          SortCss({
            sort: 'mobile-first',
          }),
        ],
      },
    },
    
    plugins: [
      injectHTML(),
      FullReload(['./src/**/**.html']),
    ],
  };
});