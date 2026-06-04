function formatList(plugins) {
  if (plugins.length === 0) return 'Aucun plugin disponible dans le catalogue.';
  return plugins.map((p) => `  ${p.name.padEnd(30)} [${p.category}]  ${p.description}`).join('\n');
}

async function runList(catalogue) {
  const { plugins } = await catalogue.fetchCatalogue();
  console.info('\nPlugins disponibles :\n');
  console.info(formatList(plugins));
  console.info();
}

module.exports = { formatList, runList };
