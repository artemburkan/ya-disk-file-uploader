import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier/flat'
import prettierPlugin from 'eslint-plugin-prettier'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Разрешаем явный any
      '@typescript-eslint/no-explicit-any': 'off',
      // другие правила импорта, если нужно
      'import/order': ['error', { 'newlines-between': 'never' }],
      'import/no-duplicates': 'error',

      'prettier/prettier': ['error', {
        printWidth: 100,
        semi: false,
        singleQuote: false,
        bracketSpacing: false,
        trailingComma: 'all',
        arrowParens: "always",
      }]
    },
  },
])
