const security = require('eslint-plugin-security');

// Biome owns formatting and the style/correctness lint (see biome.json). ESLint
// survives for eslint-plugin-security alone: Biome has no equivalent for its
// pattern-detection rules, and for JS the SAST *is* the linter — removing it
// would leave the CI security job with no command to run.
module.exports = [
  security.configs.recommended,
  {
    rules: {
      // Every fs path in this CLI is dynamic by nature; the real boundary is
      // assertSafeRelPath(), which the rule cannot see. Left on, it is 16
      // permanent warnings that train the reader to ignore the output.
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'coverage/', '**/dist/', '.vscode/', 'plugins/'],
  },
];
