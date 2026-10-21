#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const catalogue = require('../src/catalogue');
const { runList } = require('../src/commands/list');
const { runSearch } = require('../src/commands/search');
const { runInfo } = require('../src/commands/info');
const { runInstall } = require('../src/commands/install');
const { runUninstall } = require('../src/commands/uninstall');
const { runPurge } = require('../src/commands/purge');

const program = new Command();

const BASE_DIR_HELP = 'Répertoire de base (défaut : répertoire home)';

function addTargetOptions(command, destHelp, platformVerb) {
  return command
    .option('--dest <chemin>', destHelp)
    .option('--claude', `${platformVerb} ~/.claude/skills/`)
    .option('--gemini', `${platformVerb} ~/.gemini/skills/`)
    .option('--copilot', `${platformVerb} ~/.copilot/skills/`);
}

program
  .name('ezai')
  .description('CLI du marketplace de skills IA ezai')
  .version(require('../package.json').version);

program
  .command('list')
  .description('Lister tous les plugins disponibles')
  .action(() => runList(catalogue));

program
  .command('search <terme>')
  .description('Rechercher un plugin par nom ou catégorie')
  .action((terme) => runSearch(terme, catalogue));

program
  .command('info <plugin>')
  .description("Afficher les détails d'un plugin")
  .action((plugin) => runInfo(plugin, catalogue));

addTargetOptions(
  program.command('install [plugin]'),
  'Répertoire de destination (défaut : répertoire home)',
  'Déployer les symlinks vers'
)
  .description('Installer un plugin (ou tous si aucun nom fourni) dans .agents/')
  .action((plugin, options) => runInstall(plugin, options, catalogue));

addTargetOptions(program.command('purge'), BASE_DIR_HELP, 'Cibler uniquement')
  .description('Supprimer les skills ezai obsolètes (absents du catalogue actuel)')
  .action((options) => runPurge(options, catalogue));

addTargetOptions(
  program.command('uninstall [skill]'),
  BASE_DIR_HELP,
  'Supprimer uniquement les symlinks'
)
  .description('Désinstaller un skill (ou tous si aucun nom fourni)')
  .action((skill, options) => runUninstall(skill, options, catalogue));

program.parseAsync().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
