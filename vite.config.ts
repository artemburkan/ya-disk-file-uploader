import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { generateScopedName } from './config-utils/generateScopedName'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase', // or 'camelCaseOnly',
      // Use CSS Modules by default, even without `.module.css`
      generateScopedName,
    },
  },
})
