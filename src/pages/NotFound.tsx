import { type JSX } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFound(): JSX.Element {
  useDocumentTitle('页面未找到｜上海大学科学家精神主题宣传馆');

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
