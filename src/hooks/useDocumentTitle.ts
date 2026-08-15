import { useEffect } from 'react';

export function useDocumentTitle(title: string, description?: string): void {
  useEffect(() => {
    document.title = title;

    if (!description) {
      return;
    }

    let descriptionElement = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (!descriptionElement) {
      descriptionElement = document.createElement('meta');
      descriptionElement.name = 'description';
      document.head.append(descriptionElement);
    }

    descriptionElement.content = description;
  }, [description, title]);
}
