'use strict';

const os = require('node:os');
const path = require('node:path');

const DEFAULT_PLATFORMS = [
  { name: 'Claude Code', dir: path.join(os.homedir(), '.claude') },
  { name: 'Gemini CLI', dir: path.join(os.homedir(), '.gemini') },
  { name: 'Copilot', dir: path.join(os.homedir(), '.copilot') },
];

function resolvePlatforms(options = {}) {
  const deployAll = !options.claude && !options.gemini && !options.copilot;
  return DEFAULT_PLATFORMS.filter(({ name }) => {
    if (deployAll) return true;
    if (options.claude && name === 'Claude Code') return true;
    if (options.gemini && name === 'Gemini CLI') return true;
    if (options.copilot && name === 'Copilot') return true;
    return false;
  });
}

module.exports = { DEFAULT_PLATFORMS, resolvePlatforms };
