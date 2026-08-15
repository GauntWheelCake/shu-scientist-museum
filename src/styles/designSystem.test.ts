// @ts-expect-error -- Node types are intentionally not global in the browser application.
import { readFileSync } from 'node:fs';

const allowedPalette = ['#171717', '#8f1d22', '#a68452', '#c52a2f', '#d5c5a6', '#f3efe7'];
const allowedRgbChannels = [
  '23 23 23',
  '143 29 34',
  '166 132 82',
  '197 42 47',
  '213 197 166',
  '243 239 231',
];

const stylesheetFiles = ['tokens.css', 'base.css', 'components.css', 'utilities.css'] as const;

function readStylesheet(file: (typeof stylesheetFiles)[number]): string {
  return readFileSync(`src/styles/${file}`, 'utf8');
}

function readStylesheets(): string {
  return stylesheetFiles.map(readStylesheet).join('\n');
}

it('keeps every stylesheet hex color within the approved six-color palette', () => {
  const styles = readStylesheets();
  const colors = [...new Set(styles.match(/#[0-9a-f]{6}\b/gi)?.map((color) => color.toLowerCase()))]
    .sort();

  expect(colors).toEqual(allowedPalette);
});

it('keeps every rgb color within the approved six-color palette', () => {
  const styles = readStylesheets();
  const rgbChannels = [
    ...new Set([...styles.matchAll(/rgb\(\s*(\d+\s+\d+\s+\d+)/gi)].map((match) => match[1])),
  ].sort();
  const unexpectedRgbChannels = rgbChannels.filter(
    (channels) => !allowedRgbChannels.includes(channels),
  );

  expect(unexpectedRgbChannels).toEqual([]);
});

it('keeps spacing declarations deterministic and on the eight-pixel grid', () => {
  const spacingProperty =
    /(?:^|\n)\s*(?:gap|row-gap|column-gap|padding(?:-[\w-]+)?|margin(?:-[\w-]+)?)\s*:\s*([^;]+);/g;
  const styles = readStylesheets();
  const spacingValues = [...styles.matchAll(spacingProperty)].map((match) => match[1].trim());
  const dynamicSpacing = spacingValues.filter((value) => /clamp\(|-?\d*\.?\d+vw\b/.test(value));

  const gridStyles = ['tokens.css', 'base.css', 'components.css'].map((file) =>
    readFileSync(`src/styles/${file}`, 'utf8'),
  );
  const gridSpacingValues = gridStyles.flatMap((style) =>
    [...style.matchAll(spacingProperty)].map((match) => match[1].trim()),
  );
  const offGridValues = gridSpacingValues.flatMap((value) =>
    [...value.matchAll(/(-?\d+(?:\.\d+)?)(px|rem)\b/g)]
      .map((match) => (match[2] === 'rem' ? Number(match[1]) * 16 : Number(match[1])))
      .filter((pixels) => pixels % 8 !== 0),
  );

  expect(dynamicSpacing).toEqual([]);
  expect(offGridValues).toEqual([]);
});

it('uses fixed 16, 24 and 32 pixel page gutters at explicit breakpoints', () => {
  const tokens = readStylesheet('tokens.css');
  const gutterValues = [...tokens.matchAll(/--page-gutter:\s*([^;]+);/g)].map(
    (match) => match[1],
  );

  expect(gutterValues).toEqual(['1rem', '1.5rem', '2rem']);
  expect(tokens).toContain('@media (min-width: 42rem)');
  expect(tokens).toContain('@media (min-width: 68rem)');
});

it('uses one exact desktop breakpoint for header CSS', () => {
  const components = readStylesheet('components.css');

  expect(components).toContain('@media (width < 68rem)');
  expect(components).not.toContain('68.0625rem');
});

it('steps navigation and section spacing through fixed grid values', () => {
  const components = readStylesheet('components.css');
  const utilities = readStylesheet('utilities.css');
  const valuesFor = (styles: string, selector: string, property: string): string[] => [
    ...styles.matchAll(
      new RegExp(`${selector}\\s*\\{[^}]*${property}:\\s*([^;]+);`, 'g'),
    ),
  ].map((match) => match[1].trim());

  expect(valuesFor(components, '\\.primary-nav__list', 'gap')).toEqual([
    'var(--space-2)',
    'var(--space-3)',
  ]);
  expect(valuesFor(components, '\\.page-intro', 'padding-block')).toEqual([
    'var(--space-8)',
    'var(--space-10)',
    'var(--space-12)',
  ]);
  expect(valuesFor(utilities, '\\.section-space', 'padding-block')).toEqual([
    'var(--space-6)',
    'var(--space-8)',
    'var(--space-12)',
  ]);
});
