import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5175 },
  resolve: {
    alias: {
      // jsPDF optional dependencies — stub files to prevent import errors
      canvg: path.resolve(__dirname, 'src/stubs/canvg.js'),
      html2canvas: path.resolve(__dirname, 'src/stubs/html2canvas.js'),
      dompurify: path.resolve(__dirname, 'src/stubs/dompurify.js'),
    },
  },
  build: {
    rollupOptions: {
      external: ['canvg', 'html2canvas', 'dompurify'],
    },
  },
})
