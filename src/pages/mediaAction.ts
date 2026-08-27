import type { MediaItem } from '../content/types';
import { isValidPublishedMediaUrl } from '../content/media-url';

export type ExternalMediaAction = { label: string; href: string };

export function mediaAction(item: MediaItem): ExternalMediaAction | null {
  if (
    item.status !== 'published' ||
    !item.platform?.trim() ||
    !isValidPublishedMediaUrl(item.url)
  ) {
    return null;
  }

  return { label: `在${item.platform}打开`, href: item.url };
}
