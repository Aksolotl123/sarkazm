import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// BASE_PATH pozwala zbudować aplikację pod podścieżką (np. GitHub Pages: /sarkazm/).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
