export type SourceLibraryReference = {
  id: string;
  sourceFile: string;
};

export type SourceLibraryIssue = {
  code: 'SOURCE_FILE_MISSING' | 'SOURCE_PATH_ESCAPE';
  sourceId: string;
  sourceFile: string;
  message: string;
};

export function validateSourceLibrary(
  root: string,
  records: readonly SourceLibraryReference[],
): SourceLibraryIssue[] {
  const resolvedRoot = resolve(root);

  return records.flatMap((record): SourceLibraryIssue[] => {
    const hasAbsolutePrefix = /^[a-z]:[\\/]|^[/\\]/i.test(record.sourceFile);
    const resolvedSource = resolve(resolvedRoot, ...record.sourceFile.split(/[\\/]/));
    const relativeSource = relative(resolvedRoot, resolvedSource);
    const escapesRoot =
      hasAbsolutePrefix ||
      isAbsolute(relativeSource) ||
      relativeSource === '..' ||
      relativeSource.startsWith(`..${sep}`);

    if (escapesRoot) {
      return [
        {
          code: 'SOURCE_PATH_ESCAPE' as const,
          sourceId: record.id,
          sourceFile: record.sourceFile,
          message: `来源路径越出资料库根目录：${record.sourceFile}`,
        },
      ];
    }

    try {
      if (statSync(resolvedSource).isFile()) {
        return [];
      }
    } catch {
      // The issue below deliberately treats an unreadable path as unavailable.
    }

    return [
      {
        code: 'SOURCE_FILE_MISSING' as const,
        sourceId: record.id,
        sourceFile: record.sourceFile,
        message: `来源资料不存在：${record.sourceFile}`,
      },
    ];
  });
}
// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { statSync } from 'node:fs';
// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { isAbsolute, relative, resolve, sep } from 'node:path';
