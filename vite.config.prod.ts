import defaults from "./vite.config"
import { defineConfig, mergeConfig } from "vite"

export default mergeConfig(defaults, defineConfig({
  build: {
    lib: {
      name: 'vue-obs-eventbus',
      formats: ['es', 'cjs'],
      entry: './lib/index.ts',
      fileName: 'vue-obs-eventbus.prod'
    },
  },
  define: {
    __DEV__: `(process.env.NODE_ENV !== 'production')`
  }
}))
