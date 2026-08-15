import { describe, expect, it } from 'vitest';
import { archives } from './archives';
import { sources } from './sources';

describe('museum asset sources', () => {
  it('traces every public archive image to its declared source id', () => {
    for (const archive of archives) {
      expect(sources).toContainEqual(
        expect.objectContaining({
          id: archive.sourceId,
          assetPath: archive.image,
          alt: archive.alt,
        }),
      );
    }
  });

  it('records a real file, locator, usage and alt for every published asset', () => {
    expect(sources.length).toBeGreaterThan(0);

    for (const source of sources) {
      expect(source.id).toMatch(/^source-[a-z0-9-]+$/);
      expect(source.sourceFile).not.toHaveLength(0);
      expect(source.locator).toMatch(/^(slide|page) \d+$/);
      expect(source.usage).not.toHaveLength(0);
      expect(source.alt).not.toHaveLength(0);
      expect(source.assetPath).toMatch(/^\/images\/(scientists|archives)\/[a-z0-9-]+\.webp$/);
    }
  });

  it('gives each historical image asset a unique source id', () => {
    const historicalSources = sources.filter((source) => source.kind === 'historical-photo');
    const ids = historicalSources.map((source) => source.id);

    expect(historicalSources.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
