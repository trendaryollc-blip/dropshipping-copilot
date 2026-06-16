import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['src/test/setup.ts'],
    coverage: { reporter: ['text', 'lcov'] },
    include: ['src/__tests__/**/*.test.ts'],
  },
})