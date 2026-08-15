import { type JSX } from 'react';
import { getPageMeta } from '../app/site-meta';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFound(): JSX.Element {
  useDocumentTitle(getPageMeta('/not-found'));

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <p className="not-found__code" aria-hidden="true">404</p>
      <h1 id="not-found-title">页面未找到</h1>
      <p>这份展馆档案暂时无法定位。可以从首页或人物群像继续参观。</p>
      <div className="not-found__actions">
        <Link className="home-button home-button--brand" to="/">
          返回首页
        </Link>
        <Link className="home-button home-button--outline-dark" to="/scientists">
          浏览前辈群像
        </Link>
      </div>
    </section>
  );
}
