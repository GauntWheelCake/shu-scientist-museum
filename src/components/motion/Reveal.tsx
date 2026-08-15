import { useEffect, useRef, useState, type CSSProperties, type JSX, type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type RevealProps = {
  children: ReactNode;
  delay?: number;
};

export function Reveal({ children, delay = 0 }: RevealProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return undefined;
    }

    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const style = {
    '--reveal-delay': `${Math.max(0, delay)}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : 'translateY(0.5rem)',
  } as CSSProperties;

  return (
    <div ref={elementRef} className="reveal" style={style}>
      {children}
    </div>
  );
}
