const { formatList } = require('../../lib/commands/list');
const { formatSearch } = require('../../lib/commands/search');
const { formatInfo } = require('../../lib/commands/info');

const plugins = [
  { name: 'skill-seo', description: 'Expert SEO', category: 'marketing', version: '1.0.0' },
  { name: 'skill-code', description: 'Code reviewer', category: 'dev', version: '2.1.0' },
];

describe('formatList', () => {
  it('retourne une ligne par plugin', () => {
    const output = formatList(plugins);
    expect(output).toContain('skill-seo');
    expect(output).toContain('skill-code');
    expect(output).toContain('marketing');
    expect(output).toContain('dev');
  });

  it('affiche un message si catalogue vide', () => {
    const output = formatList([]);
    expect(output).toContain('Aucun plugin');
  });
});

describe('formatSearch', () => {
  it('filtre et formate les résultats', () => {
    const output = formatSearch(plugins, 'seo');
    expect(output).toContain('skill-seo');
    expect(output).not.toContain('skill-code');
  });

  it('affiche un message si aucun résultat', () => {
    const output = formatSearch(plugins, 'xxxxxx');
    expect(output).toContain('Aucun résultat');
  });
});

describe('formatInfo', () => {
  it("affiche les détails complets d'un plugin", () => {
    const output = formatInfo(plugins[0]);
    expect(output).toContain('skill-seo');
    expect(output).toContain('Expert SEO');
    expect(output).toContain('marketing');
    expect(output).toContain('1.0.0');
  });

  it('retourne un message si plugin non trouvé', () => {
    const output = formatInfo(null);
    expect(output).toContain('introuvable');
  });
});
