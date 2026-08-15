import { useEffect, useMemo, useRef, useState, type JSX, type KeyboardEvent } from 'react';
import type { ArchiveItem } from '../../content/types';
import { ResilientImage } from '../common/ResilientImage';

type ArchiveViewerProps = {
  items: ArchiveItem[];
  initialId: string;
  onClose: () => void;
};

export function ArchiveViewer({ items, initialId, onClose }: ArchiveViewerProps): JSX.Element | null {
  const initialIndex = Math.max(
    0,
    items.findIndex((item) => item.id === initialId),
  );
  const [selectedId, setSelectedId] = useState(items[initialIndex]?.id ?? '');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0],
    [items, selectedId],
  );

  useEffect(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }

    closeButtonRef.current?.focus();

    return () => returnFocusRef.current?.focus();
  }, []);

  if (!selectedItem) {
    return null;
  }

  const close = () => {
    dialogRef.current?.close?.();
    returnFocusRef.current?.focus();
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="archive-viewer"
      aria-labelledby="archive-viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="archive-viewer__panel">
        <button
          ref={closeButtonRef}
          className="archive-viewer__close"
          type="button"
          aria-label="关闭档案查看器"
          onClick={close}
        >
          ×
        </button>
        <div className="archive-viewer__media">
          <ResilientImage
            key={selectedItem.id}
            src={selectedItem.image}
            alt={selectedItem.alt}
            fallbackLabel={selectedItem.title}
            className="archive-viewer__image"
          />
        </div>
        <div className="archive-viewer__content">
          <p className="archive-viewer__kind">{selectedItem.kind}</p>
          <h2 id="archive-viewer-title">{selectedItem.title}</h2>
          <p>{selectedItem.description}</p>
          <dl className="archive-viewer__metadata">
            <div>
              <dt className="visually-hidden">年份</dt>
              <dd>年份：{selectedItem.year}</dd>
            </div>
            <div>
              <dt className="visually-hidden">来源</dt>
              <dd>来源：{selectedItem.sourceId}</dd>
            </div>
            <div>
              <dt className="visually-hidden">图片说明</dt>
              <dd>图片说明：{selectedItem.alt}</dd>
            </div>
          </dl>
          {items.length > 1 ? (
            <div className="archive-viewer__records" aria-label="选择档案">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === selectedItem.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
