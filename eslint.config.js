const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier/flat');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
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

      // ES6+
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'object-shorthand': ['error', 'always'],
    },
  },
  {
    // Les scripts de build parlent à la console : c'est leur sortie, pas du debug.
    files: ['tests/**/*.js', 'scripts/**/*.js'],
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
