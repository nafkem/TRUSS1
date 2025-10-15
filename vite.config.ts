import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Required for ethers.js v6 to work properly
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Polyfill for Node.js modules used by ethers
      util: 'util/',
      stream: 'stream-browserify',
      buffer: 'buffer/',
      crypto: 'crypto-browserify',
    },
  },
  optimizeDeps: {
    // Include ethers and related dependencies for optimization
    include: ['ethers', 'buffer', 'crypto-browserify', 'stream-browserify'],
    esbuildOptions: {
      // Define global variables for browser environment
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    // Ensure proper bundling of ethers
    commonjsOptions: {
      include: [/node_modules/, /ethers/],
    },
  },
})