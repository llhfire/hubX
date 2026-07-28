import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
