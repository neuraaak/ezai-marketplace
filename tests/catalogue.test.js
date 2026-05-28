const { fetchCatalogue, filterPlugins } = require('../lib/catalogue');

describe('fetchCatalogue', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('retourne les plugins depuis marketplace.json', async () => {
    const mockData = {
      version: '1.0.0',
      plugins: [
        {
          name: 'skill-test',
          description: 'Un test',
          category: 'dev',
          version: '1.0.0',
          path: 'plugins/skill-test',
        },
      ],
    };
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchCatalogue();

    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('lève une erreur si le fetch échoue', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, status: 404 });

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
