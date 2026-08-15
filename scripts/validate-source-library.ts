import { validateSourceLibrary } from '../src/content/source-library';
import { sources } from '../src/content/sources';

declare const process: {
  argv: string[];
  exitCode?: number;
};

const args = process.argv.slice(2);
const rootFlagIndex = args.indexOf('--root');
const root = rootFlagIndex >= 0 ? args[rootFlagIndex + 1] : undefined;

if (!root) {
  console.error('Usage: npm run validate:sources -- --root <source-library-root>');
  process.exitCode = 1;
} else {
  const issues = validateSourceLibrary(root, sources);

  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`[${issue.code}] ${issue.sourceId}: ${issue.message}`);
    }
    console.error(`Source library validation failed: ${issues.length} issue(s).`);
    process.exitCode = 1;
  } else {
    const uniqueFiles = new Set(sources.map((source) => source.sourceFile)).size;
    console.log(
      `Source library validation passed: ${sources.length}/${sources.length} records, ${uniqueFiles} unique files.`,
    );
  }
}
