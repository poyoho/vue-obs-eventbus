/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from "path"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  build: {
    lib: {
      name: 'vue-obs-eventbus',
      formats: ['es', 'cjs'],
      entry: './lib/index.ts',
      fileName: 'vue-obs-eventbus'
    },
    rollupOptions: {
      external: ['vue-demi', '@vue/devtools-api'],
    },
    emptyOutDir: false,
  },
  esbuild: {
    target: 'es6',
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
