const { fetchCatalogue, filterPlugins } = require('../src/catalogue');

describe('fetchCatalogue', () => {
  const originalEnv = process.env.EZAI_CATALOGUE_URL;

  afterEach(() => {
    process.env.EZAI_CATALOGUE_URL = originalEnv || '';
    if (!originalEnv) delete process.env.EZAI_CATALOGUE_URL;
    jest.resetAllMocks();
  });

  it('lit le catalogue local bundlé par défaut', async () => {
    delete process.env.EZAI_CATALOGUE_URL;

    const result = await fetchCatalogue();

    expect(result).toHaveProperty('plugins');
    expect(Array.isArray(result.plugins)).toBe(true);
    expect(result.plugins.length).toBeGreaterThan(0);
  });

  it('utilise EZAI_CATALOGUE_URL si défini', async () => {
    process.env.EZAI_CATALOGUE_URL = 'https://example.com/catalogue.json';
    const mockData = { plugins: [{ name: 'skill-test', description: 'test', category: 'dev' }] };
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => mockData });

    const result = await fetchCatalogue();

    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledWith('https://example.com/catalogue.json');
  });

  it('lève une erreur si EZAI_CATALOGUE_URL retourne une erreur HTTP', async () => {
    process.env.EZAI_CATALOGUE_URL = 'https://example.com/catalogue.json';
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });

    await expect(fetchCatalogue()).rejects.toThrow(
      'Impossible de récupérer le catalogue (HTTP 404)'
    );
  });
});

describe('filterPlugins', () => {
  const plugins = [
    { name: 'skill-seo', description: 'Expert SEO', category: 'marketing' },
    { name: 'skill-code', description: 'Code reviewer', category: 'dev' },
    { name: 'skill-data', description: 'Data analyst', category: 'dev' },
  ];

  it('filtre par nom', () => {
    const result = filterPlugins(plugins, 'seo');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('skill-seo');
  });

  it('filtre par catégorie', () => {
    const result = filterPlugins(plugins, 'dev');
    expect(result).toHaveLength(2);
  });

  it('retourne tous les plugins si terme vide', () => {
    const result = filterPlugins(plugins, '');
    expect(result).toHaveLength(3);
  });

  it('est insensible à la casse', () => {
    const result = filterPlugins(plugins, 'SEO');
    expect(result).toHaveLength(1);
  });
});
