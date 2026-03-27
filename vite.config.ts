import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // GitHub Pages deploys to https://<user>.github.io/<repo>/
  // Set base to your repo name, or use './' for relative paths
  base: '/LittleArtisitSimulator/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
