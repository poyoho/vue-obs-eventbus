/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from "path"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  build: {
    lib: {
      name: 'vue-obs-eventbus',
      formats: ['es'],
      entry: './lib/index.ts'
    },
    rollupOptions: {
      external: ['vue-demi', '@vue/devtools-api'],
    }
  },
  define: {
    __DEV__: true
  },
  resolve: {
    alias: {
      "vue-obs-eventbus": path.resolve("./lib/index.ts")
    }
  },
  plugins: [
    vue()
  ],
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['cobertura', 'text', 'text-summary']
    }
  }
})
