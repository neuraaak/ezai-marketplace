function formatCapabilities(capabilities) {
  if (!capabilities || capabilities.length === 0) return '';
  const lines = capabilities.map((c) => `  - ${c.id}: ${c.description}`).join('\n');
  return `Capacités:\n${lines}\n`;
}

function formatInfo(plugin) {
  if (!plugin) return 'Plugin introuvable dans le catalogue.';
  return [
    `\nNom      : ${plugin.name}`,
    `Version  : ${plugin.version}`,
    `Catégorie: ${plugin.category}`,
    `Desc.    : ${plugin.description}`,
    `Chemin   : ${plugin.path || 'n/a'}`,
    formatCapabilities(plugin.capabilities),
  ]
    .filter(Boolean)
    .join('\n');
}

async function runInfo(name, catalogue) {
  const { plugins } = await catalogue.fetchCatalogue();
  const plugin = plugins.find((p) => p.name === name) || null;
  console.info(formatInfo(plugin));
}

module.exports = { formatInfo, runInfo };
