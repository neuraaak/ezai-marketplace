const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier/flat');
const security = require('eslint-plugin-security');

module.exports = [
  js.configs.recommended,
  security.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
        fetch: 'readonly',
      },
    },
    rules: {
      // Best Practices
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-process-exit': 'error',
      'no-return-await': 'error',

      // Every fs path in this CLI is dynamic by nature; the real boundary is
      // assertSafeRelPath(), which the rule cannot see. Left on, it is 16
      // permanent warnings that train the reader to ignore the output.
      'security/detect-non-literal-fs-filename': 'off',

      // ES6+
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'object-shorthand': ['error', 'always'],
    },
  },
  {
    files: ['tests/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'coverage/', 'dist/', '.vscode/'],
  },
  // Must be last: disables all ESLint rules that conflict with Prettier.
  prettier,
];
