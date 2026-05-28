#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const catalogue = require('../src/catalogue');
const { runList } = require('../src/commands/list');
const { runSearch } = require('../src/commands/search');
const { runInfo } = require('../src/commands/info');
const { runInstall } = require('../src/commands/install');
const { runUninstall } = require('../src/commands/uninstall');

const program = new Command();

program.name('ezai').description('CLI du marketplace de skills IA ezai').version('1.0.0');

program
  .command('list')
  .description('Lister tous les plugins disponibles')
  .action(() =>
    runList(catalogue).catch((err) => {
      console.error(err.message);
      process.exit(1);
    })
  );

program
  .command('search <terme>')
  .description('Rechercher un plugin par nom ou catégorie')
  .action((terme) =>
    runSearch(terme, catalogue).catch((err) => {
      console.error(err.message);
      process.exit(1);
    })
  );

program
  .command('info <plugin>')
  .description("Afficher les détails d'un plugin")
  .action((plugin) =>
    runInfo(plugin, catalogue).catch((err) => {
      console.error(err.message);
      process.exit(1);
    })
  );

program
  .command('install [plugin]')
  .description('Installer un plugin (ou tous si aucun nom fourni) dans .agents/')
  .option('--dest <chemin>', 'Répertoire de destination (défaut : répertoire courant)')
  .option('--claude', 'Déployer les symlinks vers ~/.claude/skills/')
  .option('--gemini', 'Déployer les symlinks vers ~/.gemini/skills/')
  .option('--copilot', 'Déployer les symlinks vers ~/.copilot/skills/')
  .action((plugin, options) =>
    runInstall(plugin, options, catalogue).catch((err) => {
      console.error(err.message);
      process.exit(1);
    })
  );

program
  .command('uninstall [skill]')
  .description('Désinstaller un skill (ou tous si aucun nom fourni)')
  .option('--dest <chemin>', 'Répertoire de base (défaut : répertoire courant)')
  .option('--claude', 'Supprimer uniquement les symlinks ~/.claude/skills/')
  .option('--gemini', 'Supprimer uniquement les symlinks ~/.gemini/skills/')
  .option('--copilot', 'Supprimer uniquement les symlinks ~/.copilot/skills/')
  .action((skill, options) =>
    runUninstall(skill, options).catch((err) => {
      console.error(err.message);
      process.exit(1);
    })
  );

program.parse();
