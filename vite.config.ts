import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
//import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths() /*, visualizer()*/],
    envDir: './env',
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use 'sass:math'; @import "./src/css/core.scss";`,
            },
        },
    },
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    build: {
        minify: false,
        rollupOptions: {
          output: {
            assetFileNames: "[name].[ext]",
          },
        },
      },
});
