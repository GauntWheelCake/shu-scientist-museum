import { type JSX } from 'react';
import { getPageMeta } from '../app/site-meta';
import { PageIntro } from '../components/common/PageIntro';
import { ResilientImage } from '../components/common/ResilientImage';
import { media } from '../content/media';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { mediaAction } from './mediaAction';

export function Media(): JSX.Element {
  useDocumentTitle(getPageMeta('/media'));

  return (
    <>
      <PageIntro
        eyebrow="资料状态"
        title="影音档案"
        description="仅为已核实的公开影音提供平台入口；其余资料以整理状态保留。"
      />
      <section className="media-page" aria-labelledby="media-archive-title">
        <div className="media-page__heading">
          <p>声像资料</p>
          <h2 id="media-archive-title">影音档案状态</h2>
        </div>
        <div className="media-card-grid">
          {media.map((item) => {
            const action = mediaAction(item);

            return (
              <article key={item.id} className="media-card">
                <ResilientImage
                  className="media-card__image"
                  src={item.image}
                  alt={item.alt}
                  fallbackLabel={item.title}
                />
                <div className="media-card__content">
                  <div className="media-card__meta">
                    <span>{item.kind === 'video' ? '影像' : '音频'}</span>
                    <span>{action ? `已公开 · ${item.platform}` : '资料整理中'}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {action ? (
                    <a href={action.href} target="_blank" rel="noreferrer noopener">
                      {action.label}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
