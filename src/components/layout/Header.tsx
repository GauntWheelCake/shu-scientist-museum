import { useEffect, useRef, useState, type JSX } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MobileNav } from './MobileNav';

const primaryNavigationItems = [
  { label: '首页', to: '/' },
  { label: '前辈群像', to: '/scientists' },
  { label: '岁月长河', to: '/timeline' },
  { label: '精神谱系', to: '/spirit' },
  { label: '科学家图谱', to: '/graph' },
  { label: '精神足迹', to: '/footprints' },
  { label: '影音档案', to: '/media' },
] as const;

const desktopViewportQuery = '(min-width: 68.0625rem)';

export function Header(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const desktopViewport = window.matchMedia(desktopViewportQuery);
    const closeMenuOnDesktop = (event: MediaQueryListEvent): void => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    desktopViewport.addEventListener('change', closeMenuOnDesktop);

    return () => desktopViewport.removeEventListener('change', closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner site-container">
        <Link className="site-brand" to="/" aria-label="上海大学科学家精神数字展馆首页">
          <img className="site-brand__logo" src="/logo.svg" alt="上海大学" />
          <span className="site-brand__name">科学家精神数字展馆</span>
        </Link>

        <nav className="primary-nav" aria-label="主导航">
          <ul className="primary-nav__list">
            {primaryNavigationItems.map((item) => (
              <li key={item.to}>
                <NavLink className="primary-nav__link" end={item.to === '/'} to={item.to}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButtonRef}
          className="mobile-menu-button"
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span className="mobile-menu-button__lines" aria-hidden="true" />
        </button>
      </div>

      {isMenuOpen ? <MobileNav onNavigate={() => setIsMenuOpen(false)} /> : null}
    </header>
  );
}
