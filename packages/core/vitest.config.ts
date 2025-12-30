import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment
    // 'node': Node.js環境（Web標準API + Node.js APIが使える）
    // 'edge-runtime': Edge Runtime環境（Web標準APIのみ、より厳密）
    // Web標準のみを使用する場合はedge-runtimeを推奨しますが、
    // 追加パッケージ（@edge-runtime/vm）が必要です
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
  },
});
