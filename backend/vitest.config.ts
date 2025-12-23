import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    coverage: {
      provider: 'v8',
      exclude: [
        'src/generated/**',
        'src/dtos/**',
        'src/models/**',
        'src/index.ts',
        'src/graphql/**',
        '**/*.d.ts',
        'test/**',
        'vite.config.ts',
        'vitest.config.ts',
        '.eslintrc.js',
      ],
    },
  },
})
