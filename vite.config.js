import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssNesting from 'postcss-nesting'
import postcssVhFix from 'postcss-viewport-height-correction'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Lita",
  css: {
    postcss: {
      plugins: [
        postcssNesting,
        postcssVhFix
      ],
    },
  },
  plugins: [react()],
})
