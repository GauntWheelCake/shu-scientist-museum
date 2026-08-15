import { withBasePath } from './publicAsset';

describe('withBasePath', () => {
  it('prefixes root-relative public assets for a repository deployment', () => {
    expect(withBasePath('/images/scientists/qian-weichang.webp', '/shu-scientist-museum/')).toBe(
      '/shu-scientist-museum/images/scientists/qian-weichang.webp',
    );
    expect(withBasePath('/logo.svg', '/shu-scientist-museum/')).toBe(
      '/shu-scientist-museum/logo.svg',
    );
  });

  it('keeps root deployments and external assets unchanged', () => {
    expect(withBasePath('/images/scientists/qian-weichang.webp', '/')).toBe(
      '/images/scientists/qian-weichang.webp',
    );
    expect(withBasePath('https://example.edu/archive.webp', '/shu-scientist-museum/')).toBe(
      'https://example.edu/archive.webp',
    );
  });

  it('does not add the repository base twice', () => {
    expect(withBasePath('/shu-scientist-museum/logo.svg', '/shu-scientist-museum/')).toBe(
      '/shu-scientist-museum/logo.svg',
    );
  });
});
