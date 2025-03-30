import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // jsdom ist korrekt für React-Testing
    setupFiles: './test/setup.ts', // Optional: Setup vor Tests
    css: true // Falls CSS-Klassen im Test benötigt werden
  },
});