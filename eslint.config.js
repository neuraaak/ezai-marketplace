const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
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
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-process-exit': 'error',
      'no-return-await': 'error',

      // Style
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],

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
];
