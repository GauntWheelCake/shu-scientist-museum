// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { tmpdir } from 'node:os';
// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { archives } from './archives';
import { validateSourceLibrary } from './source-library';
import { sources } from './sources';

type DirectoryEntry = {
  name: string;
  isDirectory: () => boolean;
  isFile: () => boolean;
};

const temporaryRoots: string[] = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

function createSourceLibrary(files: string[]): string {
  const root = mkdtempSync(join(tmpdir(), 'museum-source-library-'));
  temporaryRoots.push(root);

  for (const file of files) {
    const target = join(root, ...file.split('/'));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, 'fixture');
  }

  return root;
}

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

describe('source library validation', () => {
  it('accepts a source library when every registered file exists', () => {
    const sourceFile = '演讲ppt/人物主题课件.pptx';
    const root = createSourceLibrary([sourceFile]);

    expect(validateSourceLibrary(root, [{ id: 'source-fixture', sourceFile }])).toEqual([]);
  });

  it('reports a registered source file that is missing from the supplied library root', () => {
    const root = createSourceLibrary([]);
    const sourceFile = '演讲ppt/缺失课件.pptx';

    expect(validateSourceLibrary(root, [{ id: 'source-missing', sourceFile }])).toEqual([
      {
        code: 'SOURCE_FILE_MISSING',
        sourceId: 'source-missing',
        sourceFile,
        message: '来源资料不存在：演讲ppt/缺失课件.pptx',
      },
    ]);
  });

  it('rejects a source path that escapes the supplied library root', () => {
    const root = createSourceLibrary([]);
    const sourceFile = '../外部课件.pptx';

    expect(validateSourceLibrary(root, [{ id: 'source-escape', sourceFile }])).toEqual([
      {
        code: 'SOURCE_PATH_ESCAPE',
        sourceId: 'source-escape',
        sourceFile,
        message: '来源路径越出资料库根目录：../外部课件.pptx',
      },
    ]);
  });
});
