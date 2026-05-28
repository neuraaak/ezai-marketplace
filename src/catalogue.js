const CATALOGUE_URL =
  process.env.EZAI_CATALOGUE_URL ||
  'https://raw.githubusercontent.com/Neuraaak/ezai-marketplace/main/.claude-plugin/marketplace.json';

async function fetchCatalogue() {
  const res = await fetch(CATALOGUE_URL);
  if (!res.ok) {
    throw new Error(`Impossible de récupérer le catalogue (HTTP ${res.status})`);
  }
  return res.json();
}

function filterPlugins(plugins, term) {
  if (!term) return plugins;
  const lower = term.toLowerCase();
  return plugins.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
  );
}

module.exports = { fetchCatalogue, filterPlugins, CATALOGUE_URL };
