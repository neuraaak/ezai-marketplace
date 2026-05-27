const { filterPlugins } = require('../catalogue');

function formatSearch(plugins, term) {
  const results = filterPlugins(plugins, term);
  if (results.length === 0) return `Aucun résultat pour "${term}".`;
  return results
    .map((p) => `  ${p.name.padEnd(30)} [${p.category}]  ${p.description}`)
    .join('\n');
}

async function runSearch(term, catalogue) {
  const { plugins } = await catalogue.fetchCatalogue();
  console.log(`\nRésultats pour "${term}" :\n`);
  console.log(formatSearch(plugins, term));
  console.log();
}

module.exports = { formatSearch, runSearch };
