import { act, render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { CountUp } from './CountUp';
import { Reveal } from './Reveal';
import { TimelineLine } from './TimelineLine';

function installMotionPreference(matches: boolean): void {
  const mediaQuery = Object.assign(new EventTarget(), {
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    matches,
    addListener: () => undefined,
    removeListener: () => undefined,
  }) as MediaQueryList;

  window.matchMedia = () => mediaQuery;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it('shows the final count immediately when reduced motion is preferred', () => {
  installMotionPreference(true);
  const requestFrame = vi.fn();
  vi.stubGlobal('requestAnimationFrame', requestFrame);

  render(<CountUp value={42} suffix="项" />);

  expect(screen.getByText('42项')).toBeInTheDocument();
  expect(requestFrame).not.toHaveBeenCalled();
});

it('keeps reveal and timeline content in their final state with reduced motion', () => {
  installMotionPreference(true);
  const { container } = render(
    <>
      <Reveal>档案内容</Reveal>
      <TimelineLine />
    </>,
  );

  expect(screen.getByText('档案内容')).toHaveStyle({ opacity: '1', transform: 'none' });
  expect(container.querySelector('.timeline-line__progress')).toHaveStyle({
    transform: 'scaleY(1)',
  });
});

it('starts counting after entering the viewport and reaches the exact value', () => {
  installMotionPreference(false);
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextFrameId = 0;
  const requestFrame = vi.fn((callback: FrameRequestCallback) => {
    nextFrameId += 1;
    callbacks.set(nextFrameId, callback);
    return nextFrameId;
  });
  const cancelFrame = vi.fn((frameId: number) => callbacks.delete(frameId));
  let intersectionCallback: IntersectionObserverCallback = () => undefined;
  const disconnect = vi.fn();

  vi.stubGlobal('requestAnimationFrame', requestFrame);
  vi.stubGlobal('cancelAnimationFrame', cancelFrame);
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        disconnect,
        observe: vi.fn(),
        takeRecords: () => [],
        unobserve: vi.fn(),
        root: null,
        rootMargin: '0px',
        thresholds: [0],
      };
    }),
  );

  render(<CountUp value={12} suffix="个" />);
  expect(screen.getByText('0个')).toBeInTheDocument();
  expect(requestFrame).not.toHaveBeenCalled();

  act(() => {
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });

  expect(requestFrame).toHaveBeenCalledTimes(1);
  act(() => callbacks.get(1)?.(100));
  act(() => callbacks.get(2)?.(1400));

  expect(screen.getByText('12个')).toBeInTheDocument();
  expect(disconnect).toHaveBeenCalledTimes(1);
});

it('cancels its animation frame and disconnects its observer when unmounted', () => {
  installMotionPreference(false);
  const requestFrame = vi.fn(() => 27);
  const cancelFrame = vi.fn();
  let intersectionCallback: IntersectionObserverCallback = () => undefined;
  const disconnect = vi.fn();

  vi.stubGlobal('requestAnimationFrame', requestFrame);
  vi.stubGlobal('cancelAnimationFrame', cancelFrame);
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        disconnect,
        observe: vi.fn(),
        takeRecords: () => [],
        unobserve: vi.fn(),
        root: null,
        rootMargin: '0px',
        thresholds: [0],
      };
    }),
  );

  const { unmount } = render(<CountUp value={9} />);
  act(() => {
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
  unmount();

  expect(cancelFrame).toHaveBeenCalledWith(27);
  expect(disconnect).toHaveBeenCalledTimes(1);
});
