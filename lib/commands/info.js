function formatInfo(plugin) {
  if (!plugin) return 'Plugin introuvable dans le catalogue.';
  return [
    `\nNom      : ${plugin.name}`,
    `Version  : ${plugin.version}`,
    `Catégorie: ${plugin.category}`,
    `Desc.    : ${plugin.description}`,
    `Chemin   : ${plugin.path || 'n/a'}`,
    ''
  ].join('\n');
}

async function runInfo(name, catalogue) {
  const { plugins } = await catalogue.fetchCatalogue();
  const plugin = plugins.find((p) => p.name === name) || null;
  console.log(formatInfo(plugin));
}

module.exports = { formatInfo, runInfo };
