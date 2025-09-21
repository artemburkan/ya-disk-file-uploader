import path from "path"

import {defineConfig, loadEnv} from "vite"
import react from "@vitejs/plugin-react"

import {eslintPlugin} from "./config-utils/eslint-plugin"
import {generateUniqueName} from "./config-utils/generateUniqueName"

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = mode === "development"

  const eslint = () => eslintPlugin({fix: true, configFile: "eslint.config.js"})
  const generateScopedName = generateUniqueName(isDev)

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@app": path.resolve(__dirname, "./src/app"),
        "@screens": path.resolve(__dirname, "./src/screens"),
        "@widgets": path.resolve(__dirname, "./src/widgets"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@shared": path.resolve(__dirname, "./src/shared"),
      },
    },
    plugins: [react(), eslint()],
    css: {
      modules: {generateScopedName},
    },
    define: {"process.env": env},
  }
})
