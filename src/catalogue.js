const fs = require('node:fs');
const path = require('node:path');

const LOCAL_CATALOGUE = path.resolve(__dirname, '..', '.claude-plugin', 'marketplace.json');

async function fetchCatalogue() {
  const url = process.env.EZAI_CATALOGUE_URL;
  if (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Impossible de récupérer le catalogue (HTTP ${res.status})`);
    }
    return res.json();
  }
  return JSON.parse(fs.readFileSync(LOCAL_CATALOGUE, 'utf8'));
}

function filterPlugins(plugins, term) {
  if (!term) return plugins;
  const lower = term.toLowerCase();
  return plugins.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      (p.category || '').toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower),
  );
}

module.exports = { fetchCatalogue, filterPlugins };
