const { filterPlugins } = require('../catalogue');

function formatSearch(plugins, term) {
  const results = filterPlugins(plugins, term);
  if (results.length === 0) return `Aucun résultat pour "${term}".`;
  return results.map((p) => `  ${p.name.padEnd(30)} [${p.category}]  ${p.description}`).join('\n');
}

async function runSearch(term, catalogue) {
  const { plugins } = await catalogue.fetchCatalogue();
  console.info(`\nRésultats pour "${term}" :\n`);
  console.info(formatSearch(plugins, term));
  console.info();
}

module.exports = { formatSearch, runSearch };
