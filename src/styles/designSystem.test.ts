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

function readStylesheets(): string {
  return ['tokens.css', 'base.css', 'components.css', 'utilities.css']
    .map((file) => readFileSync(`src/styles/${file}`, 'utf8'))
    .join('\n');
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

it('keeps component rem dimensions on the eight-pixel spacing grid', () => {
  const components = readFileSync('src/styles/components.css', 'utf8');
  const remValues = [...components.matchAll(/(-?\d+(?:\.\d+)?)rem\b/g)].map((match) =>
    Number(match[1]),
  );
  const offGridValues = remValues.filter((value) => !Number.isInteger(value * 2));

  expect(offGridValues).toEqual([]);
});
