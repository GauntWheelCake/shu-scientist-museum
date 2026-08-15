// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { existsSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { archives } from './archives';
import { sources } from './sources';

type DirectoryEntry = {
  name: string;
  isDirectory: () => boolean;
  isFile: () => boolean;
};

describe('museum asset sources', () => {
  function publishedWebpPaths(directory = 'public/images'): string[] {
    return readdirSync(directory, { withFileTypes: true })
      .flatMap((entry: DirectoryEntry) => {
        const diskPath = `${directory}/${entry.name}`;

        if (entry.isDirectory()) {
          return publishedWebpPaths(diskPath);
        }

        return entry.isFile() && entry.name.endsWith('.webp')
          ? [`/${diskPath.replace(/^public\//, '')}`]
          : [];
      })
      .sort();
  }

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

  it('registers every WebP actually published under public/images exactly once', () => {
    const publishedPaths = publishedWebpPaths();
    const registeredPaths = sources.map((source) => source.assetPath).sort();

    expect(publishedPaths).not.toHaveLength(0);
    expect(registeredPaths).toEqual(publishedPaths);
    expect(new Set(registeredPaths).size).toBe(registeredPaths.length);
  });

  it('records a real public asset, locator, usage and alt for every source', () => {
    expect(sources.length).toBeGreaterThan(0);

    for (const source of sources) {
      expect(source.id).toMatch(/^source-[a-z0-9-]+$/);
      expect(source.sourceFile).not.toHaveLength(0);
      expect(source.locator).toMatch(/^(slide|page) \d+$/);
      expect(source.usage).not.toHaveLength(0);
      expect(source.alt).not.toHaveLength(0);
      expect(source.assetPath).toMatch(
        /^\/images\/(scientists|archives|activities|media)\/[a-z0-9-]+\.webp$/,
      );
      expect(existsSync(`public${source.assetPath}`)).toBe(true);
    }
  });

  it('uses portable source-library-relative identifiers instead of machine paths', () => {
    for (const source of sources) {
      expect(source.sourceFile).toMatch(/^(演讲ppt|模板)\/[^/]+\.(pptx|pdf)$/);
      expect(source.sourceFile).not.toMatch(/^[a-z]:[\\/]/i);
      expect(source.sourceFile).not.toMatch(/^[/\\]|(^|[/\\])\.\.([/\\]|$)|[/\\]Users[/\\]/i);
    }
  });

  it('gives each historical image asset a unique source id', () => {
    const historicalSources = sources.filter((source) => source.kind === 'historical-photo');
    const ids = historicalSources.map((source) => source.id);

    expect(historicalSources.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
