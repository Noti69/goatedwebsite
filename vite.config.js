import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/goatedwebsite/', // EXACTLY your GitHub repo name, wrapped in slashes
})