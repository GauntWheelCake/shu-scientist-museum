import { activities } from '../src/content/activities';
import { archives } from '../src/content/archives';
import { events } from '../src/content/events';
import { media } from '../src/content/media';
import { scientists, stories } from '../src/content/scientists';
import { spiritThemes } from '../src/content/spirit-themes';
import { validateContent } from '../src/content/validate';

const issues = validateContent({
  scientists,
  stories,
  events,
  archives,
  activities,
  media,
  spiritThemes,
});

if (issues.length > 0) {
  issues.forEach(({ code, path, message }) => {
    console.error(`${code}: ${path} - ${message}`);
  });
  process.exitCode = 1;
} else {
  console.log('Content validation passed.');
}
