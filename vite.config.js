import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path' // 1. Added this import
import { fileURLToPath } from 'url' // 2. Added for __dirname support
import tailwindcss from '@tailwindcss/vite';

// 3. Define __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tailwindcss(), 
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
