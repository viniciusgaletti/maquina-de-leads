/* Vitest config: reaproveita o vite.config.ts existente (alias @, plugins). */
import { defineConfig, mergeConfig } from 'vite'
import viteConfig from './vite.config'

export default defineConfig((env) =>
  mergeConfig(
    typeof viteConfig === 'function' ? viteConfig(env) : viteConfig,
    defineConfig({
      test: {
        environment: 'node',
        globals: true,
        passWithNoTests: true,
      },
    }),
  ),
)
