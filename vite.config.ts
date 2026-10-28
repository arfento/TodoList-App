import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for dev server and production build.
// CSS Modules are supported out of the box for `*.module.css` files.
export default defineConfig({
  plugins: [react()],
})
