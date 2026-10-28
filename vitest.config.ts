import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Vitest configuration: jsdom environment, global test APIs, and
// Testing Library setup. CSS Modules are handled by the React plugin.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
