import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';
import styleImport from 'vite-plugin-style-import';
// import visualizer from 'rollup-plugin-visualizer';
import vitePluginImp from 'vite-plugin-imp';

const REPLACEMENT = `${path.resolve(__dirname, './src')}/`;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style`,
        }
      ],
    }),
    legacy({
      targets: ['defaults', 'ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
    vitePluginImp()
    // visualizer()
  ],
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: REPLACEMENT,
      }
    ],
    extensions: ['.js', '.jsx', '.vue', '.json'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/style/index.scss";'
      }
    }
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
  },
  server: {
    port: 2022,
    host: '0.0.0.0',
    proxy: {
      '/aaa': {
        target: 'https://baidu.com',
        changeOrigin: true,
      },
    },
  },
});
