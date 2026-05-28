#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const catalogue = require('../lib/catalogue');
const { runList } = require('../lib/commands/list');
const { runSearch } = require('../lib/commands/search');
const { runInfo } = require('../lib/commands/info');
const { runInstall } = require('../lib/commands/install');

const program = new Command();

program
  .name('ezai')
  .description('CLI du marketplace de skills IA ezai')
  .version('1.0.0');

program
  .command('list')
  .description('Lister tous les plugins disponibles')
  .action(() => runList(catalogue).catch((err) => { console.error(err.message); process.exit(1); }));

program
  .command('search <terme>')
  .description('Rechercher un plugin par nom ou catégorie')
  .action((terme) => runSearch(terme, catalogue).catch((err) => { console.error(err.message); process.exit(1); }));

program
  .command('info <plugin>')
  .description("Afficher les détails d'un plugin")
  .action((plugin) => runInfo(plugin, catalogue).catch((err) => { console.error(err.message); process.exit(1); }));

program
  .command('install <plugin>')
  .description('Installer un plugin dans .agents/')
  .option('--dest <chemin>', 'Répertoire de destination (défaut : répertoire courant)')
  .action((plugin, options) => runInstall(plugin, options, catalogue).catch((err) => { console.error(err.message); process.exit(1); }));

program.parse();
