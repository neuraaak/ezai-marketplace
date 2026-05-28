function formatList(plugins) {
  if (plugins.length === 0) return 'Aucun plugin disponible dans le catalogue.';
  return plugins.map((p) => `  ${p.name.padEnd(30)} [${p.category}]  ${p.description}`).join('\n');
}

async function runList(catalogue) {
  const { plugins } = await catalogue.fetchCatalogue();
  console.log('\nPlugins disponibles :\n');
  console.log(formatList(plugins));
  console.log();
}

module.exports = { formatList, runList };
