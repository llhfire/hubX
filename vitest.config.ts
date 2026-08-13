import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'tmp/**', 'output/**'],
    globals: true,
  },
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
