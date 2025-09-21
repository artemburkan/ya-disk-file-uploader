import path from "path"
import {defineConfig, loadEnv} from "vite"
import react from "@vitejs/plugin-react"
import {generateUniqueName} from "./utils/generateUniqueName"

// https://vite.dev/config/
export default defineConfig((config) => {
  const {mode} = config

  const env = loadEnv(mode, process.cwd())
  const isDev = mode === "development"

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
    plugins: [react()],
    css: {
      localsConvention: "camelCase",
      modules: {generateScopedName},
    },
    define: {"process.env": env},
  }
})
