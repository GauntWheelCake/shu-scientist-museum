import { type JSX } from 'react';
import { NavLink } from 'react-router-dom';

const primaryNavigationItems = [
  { label: '首页', to: '/' },
  { label: '前辈群像', to: '/scientists' },
  { label: '岁月长河', to: '/timeline' },
  { label: '精神谱系', to: '/spirit' },
  { label: '科学家图谱', to: '/graph' },
  { label: '精神足迹', to: '/footprints' },
  { label: '影音档案', to: '/media' },
] as const;

type MobileNavProps = {
  onNavigate: () => void;
};

export function MobileNav({ onNavigate }: MobileNavProps): JSX.Element {
  return (
    <nav id="mobile-navigation" className="mobile-nav" aria-label="移动端导航">
      <ul className="mobile-nav__list">
        {primaryNavigationItems.map((item) => (
          <li key={item.to}>
            <NavLink
              className="mobile-nav__link"
              end={item.to === '/'}
              onClick={onNavigate}
              to={item.to}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink className="mobile-nav__link" onClick={onNavigate} to="/about">
            关于项目
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
