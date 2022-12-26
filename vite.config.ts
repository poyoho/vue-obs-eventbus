/// <reference types="vitest" />
import { defineConfig } from 'vite'
import Reporter from './scripts/reporter'

export default defineConfig({
  build: {
    lib: {
      name: 'vue-obs-eventbus',
      formats: ['es', 'iife'],
      entry: './lib/index.ts'
    },
    sourcemap: true
  },
  plugins: [Reporter()],
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['cobertura', 'text', 'text-summary']
    }
  }
})
