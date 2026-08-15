import { act, renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

function installMotionPreference(initiallyReduced: boolean): {
  update: (matches: boolean) => void;
} {
  const mediaQuery = Object.assign(new EventTarget(), {
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    matches: initiallyReduced,
    addListener: () => undefined,
    removeListener: () => undefined,
  }) as MediaQueryList;

  window.matchMedia = () => mediaQuery;

  return {
    update(matches: boolean) {
      Object.defineProperty(mediaQuery, 'matches', { configurable: true, value: matches });
      const event = Object.assign(new Event('change'), { matches, media: mediaQuery.media });
      mediaQuery.dispatchEvent(event);
    },
  };
}

it('returns true when the user prefers reduced motion', () => {
  installMotionPreference(true);

  const { result } = renderHook(() => useReducedMotion());

  expect(result.current).toBe(true);
});

it('tracks changes to the reduced-motion preference', () => {
  const preference = installMotionPreference(false);
  const { result } = renderHook(() => useReducedMotion());

  act(() => preference.update(true));

  expect(result.current).toBe(true);
});
