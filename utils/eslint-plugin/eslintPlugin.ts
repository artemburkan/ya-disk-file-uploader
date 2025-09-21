import path from "path"
import {ESLint} from "eslint"
import chalk from "chalk"
import type {Plugin, ViteDevServer} from "vite"

interface Options {
  fix?: boolean
  configFile?: string
}

const SUCCESS_LINT_MESSAGE = "ESLint: no errors"

export const eslintPlugin = (options: Options = {}): Plugin => {
  const {fix = false, configFile} = options

  let overrideConfigFile

  if (configFile) {
    overrideConfigFile = path.join(process.cwd(), configFile)
  }

  const eslint = new ESLint({fix, overrideConfigFile})

  const changedFiles = new Set<string>()
  const messageLogs = new Set<string>()

  return {
    name: "eslint-on-save",
    configureServer(server: ViteDevServer) {
      server.watcher.on("change", async (file: string) => {
        if (!/\.(js|jsx|ts|tsx|vue)$/.test(file)) return

        try {
          const results = await eslint.lintFiles([file])
          const [result] = results

          if (result.errorCount) {
            changedFiles.add(result.filePath)
            const formatter = await eslint.loadFormatter("stylish")
            const resultText = await formatter.format(results)
            console.log(resultText)
            messageLogs.delete(SUCCESS_LINT_MESSAGE)
          }

          if (fix && result.output) {
            await ESLint.outputFixes(results)
            console.log(
              chalk.yellow("ESLint: has edited"),
              path.relative(process.cwd(), result.filePath),
            )
            messageLogs.delete(SUCCESS_LINT_MESSAGE)
          }

          if (!result.errorCount) {
            changedFiles.delete(result.filePath)
          }

          if (!changedFiles.size && !messageLogs.has(SUCCESS_LINT_MESSAGE)) {
            messageLogs.add(SUCCESS_LINT_MESSAGE)
            console.log(chalk.green(SUCCESS_LINT_MESSAGE))
          }
        } catch (error) {
          console.error("ESLint run with error:", error)
        }
      })
    },
  }
}

export default eslintPlugin
