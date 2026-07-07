import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/inferno-os/',            // проект-сайт GitHub Pages: valeriyclaude.github.io/inferno-os/
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5199 },  // 0.0.0.0 — доступно и с других устройств в сети
})
