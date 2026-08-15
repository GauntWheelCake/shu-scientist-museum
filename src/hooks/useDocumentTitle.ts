import { useEffect } from 'react';
import type { PageMeta } from '../app/site-meta';

export function useDocumentTitle({ title, description }: PageMeta): void {
  useEffect(() => {
    document.title = title;

    let descriptionElement = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (!descriptionElement) {
      descriptionElement = document.createElement('meta');
      descriptionElement.name = 'description';
      document.head.append(descriptionElement);
    }

    descriptionElement.content = description;
  }, [description, title]);
}
