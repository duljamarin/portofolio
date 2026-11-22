import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// scripts/build.mjs sets BUILD_DATE once for the client build, the server build
// and the prerender step, so all three agree on the date.
const BUILD_DATE = process.env.BUILD_DATE ?? new Date().toISOString().slice(0, 10)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },
  build: {
    // scripts/prerender.mjs reads the manifest to preload each page's chunk.
    manifest: true,
  },
})
