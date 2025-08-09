import nextPlugin from '@next/eslint-plugin-next';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      // Minimal rules for faster compilation
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      // Custom rules for semantic colors
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/text-white/]',
          message: 'Use semantic color tokens instead of text-white. Use text-fg, text-primary-foreground, or text-surface-foreground.',
        },
        {
          selector: 'Literal[value=/bg-white/]',
          message: 'Use semantic color tokens instead of bg-white. Use bg-surface, bg-bg, or bg-primary-foreground.',
        },
      ],
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/**', '.next/**', 'out/**'],
  },
];
