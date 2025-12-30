import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',

    // Globals (optional, for describe/it/expect without imports)
    globals: false,

    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/test/**',
        '**/tests/**',
      ],
    },

    // Include test files
    include: ['src/**/*.{test,spec}.{js,ts}'],

    // Watch mode (useful for TDD)
    watch: false,
  },
});
