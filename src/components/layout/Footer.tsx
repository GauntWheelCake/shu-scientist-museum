import { type JSX } from 'react';
import { Link } from 'react-router-dom';

const primaryNavigationItems = [
  { label: '首页', to: '/' },
  { label: '前辈群像', to: '/scientists' },
  { label: '岁月长河', to: '/timeline' },
  { label: '精神谱系', to: '/spirit' },
  { label: '科学家图谱', to: '/graph' },
  { label: '精神足迹', to: '/footprints' },
  { label: '影音档案', to: '/media' },
] as const;

export function Footer(): JSX.Element {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer__grid">
          <div>
            <h2 className="site-footer__title">上海大学科学家精神数字展馆</h2>
            <p className="site-footer__tagline">追寻前辈榜样，筑梦科技自立自强。</p>
          </div>
          <div>
            <nav aria-label="页脚快捷入口">
              <ul className="site-footer__links">
                {primaryNavigationItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/about">关于项目</Link>
                </li>
              </ul>
            </nav>
            <p className="site-footer__source">
              本展馆资料来自项目团队已核实的校史、人物档案与社会实践记录；具体来源随展项标注。
            </p>
          </div>
        </div>
        <div className="site-footer__bottom">
          <small>© {new Date().getFullYear()} 上海大学科学家精神数字展馆</small>
        </div>
      </div>
    </footer>
  );
}
