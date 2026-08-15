import { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { archives } from '../../content/archives';
import { ArchiveViewer } from './ArchiveViewer';

function ViewerHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        查看档案
      </button>
      {open ? (
        <ArchiveViewer
          items={archives.slice(0, 2)}
          initialId="archive-li-courseware"
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

describe('ArchiveViewer', () => {
  it('opens the requested record with its verified metadata and alternative text', async () => {
    const user = userEvent.setup();
    render(<ViewerHarness />);

    await user.click(screen.getByRole('button', { name: '查看档案' }));

    const dialog = screen.getByRole('dialog', { name: '李三立主题宣讲课件' });
    expect(dialog).toBeVisible();
    expect(screen.getByText('年份：2026')).toBeInTheDocument();
    expect(screen.getByText('来源：source-li-courseware')).toBeInTheDocument();
    expect(screen.getByText('图片说明：李三立主题宣讲课件封面')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '关闭档案查看器' })).toHaveFocus();
  });

  it('closes on Escape and returns focus to the control that opened it', async () => {
    const user = userEvent.setup();
    render(<ViewerHarness />);
    const trigger = screen.getByRole('button', { name: '查看档案' });

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('uses the native modal API and handles a cancel event through the close lifecycle', async () => {
    const user = userEvent.setup();
    const showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    const close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
    const originalShowModal = HTMLDialogElement.prototype.showModal;
    const originalClose = HTMLDialogElement.prototype.close;

    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: showModal,
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: close,
    });

    try {
      render(<ViewerHarness />);
      const trigger = screen.getByRole('button', { name: '查看档案' });

      await user.click(trigger);
      const dialog = screen.getByRole('dialog', { name: '李三立主题宣讲课件' });
      const cancelEvent = new Event('cancel', { cancelable: true });
      let dispatched = true;

      act(() => {
        dispatched = dialog.dispatchEvent(cancelEvent);
      });

      expect(showModal).toHaveBeenCalledTimes(1);
      expect(dispatched).toBe(false);
      expect(cancelEvent.defaultPrevented).toBe(true);
      expect(close).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    } finally {
      if (originalShowModal) {
        Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
          configurable: true,
          value: originalShowModal,
        });
      } else {
        Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
      }

      if (originalClose) {
        Object.defineProperty(HTMLDialogElement.prototype, 'close', {
          configurable: true,
          value: originalClose,
        });
      } else {
        Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
      }
    }
  });
});
