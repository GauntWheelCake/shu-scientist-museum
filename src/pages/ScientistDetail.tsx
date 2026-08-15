import { useState, type JSX } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArchiveViewer } from '../components/archive/ArchiveViewer';
import { ScientistHero } from '../components/scientist/ScientistHero';
import { ScientistTimeline } from '../components/scientist/ScientistTimeline';
import { archives } from '../content/archives';
import { events } from '../content/events';
import { scientists, stories } from '../content/scientists';
import { spiritThemes } from '../content/spirit-themes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function ScientistDetail(): JSX.Element {
  const { slug = '' } = useParams();
  const scientist = scientists.find((candidate) => candidate.slug === slug);
  const [activeArchiveId, setActiveArchiveId] = useState<string | null>(null);
  useDocumentTitle(
    scientist
      ? `${scientist.name}｜上海大学科学家精神主题宣传馆`
      : '页面未找到｜上海大学科学家精神主题宣传馆',
  );

  if (!scientist) {
    return (
      <section className="not-found" aria-labelledby="not-found-title">
        <p className="not-found__code">404</p>
        <h1 id="not-found-title">页面未找到</h1>
        <p>没有找到对应的人物档案。</p>
        <div className="not-found__actions">
          <Link to="/scientists">返回前辈群像</Link>
          <Link to="/">返回首页</Link>
        </div>
      </section>
    );
  }

  const scientistEvents = events.filter((event) => event.scientistIds.includes(scientist.id));
  const scientistArchives = archives.filter((item) => item.scientistIds.includes(scientist.id));
  const scientistStories = stories.filter((story) => story.scientistIds.includes(scientist.id));
  const spiritStories = scientistStories.flatMap((story) =>
    spiritThemes
      .filter((theme) => story.spiritIds.includes(theme.id))
      .map((theme) => ({ story, theme })),
  );
  const representativeStory = scientistStories[0];
  const featuredScientists = scientists.filter((candidate) => candidate.featured);
  const currentFeaturedIndex = featuredScientists.findIndex((candidate) => candidate.id === scientist.id);
  const nextScientist =
    featuredScientists[(currentFeaturedIndex >= 0 ? currentFeaturedIndex + 1 : 0) % featuredScientists.length];

  return (
    <article className="scientist-profile">
      <ScientistHero scientist={scientist} />

      <section className="scientist-section scientist-section--timeline" aria-labelledby="life-heading">
        <div className="scientist-section__inner">
          <p className="scientist-section__index">02</p>
          <h2 id="life-heading">生平轨迹</h2>
          <ScientistTimeline events={scientistEvents} />
        </div>
      </section>

      <section className="scientist-section" aria-labelledby="research-heading">
        <div className="scientist-section__inner">
          <p className="scientist-section__index">03</p>
          <h2 id="research-heading">科研征途</h2>
          {scientist.chapters.length > 0 ? (
            <ol className="research-chapters">
              {scientist.chapters.map((chapter, index) => (
                <li key={chapter.id}>
                  <p className="research-chapters__number">{String(index + 1).padStart(2, '0')}</p>
                  <h3>{chapter.title}</h3>
                  <dl>
                    <div>
                      <dt>问题</dt>
                      <dd>{chapter.problem}</dd>
                    </div>
                    <div>
                      <dt>行动</dt>
                      <dd>{chapter.action}</dd>
                    </div>
                    <div>
                      <dt>意义</dt>
                      <dd>{chapter.significance}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          ) : (
            <p className="scientist-section__empty">相关科研资料持续整理中。</p>
          )}
        </div>
      </section>

      {scientistArchives.length > 0 ? (
        <section className="scientist-section scientist-section--archive" aria-labelledby="archive-heading">
          <div className="scientist-section__inner">
            <p className="scientist-section__index">04</p>
            <h2 id="archive-heading">档案珍藏</h2>
            <ul className="archive-list">
              {scientistArchives.map((item) => (
                <li key={item.id}>
                  <p>{item.year}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button type="button" onClick={() => setActiveArchiveId(item.id)}>
                    查看档案
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="scientist-section scientist-section--spirit" aria-labelledby="spirit-heading">
        <div className="scientist-section__inner">
          <p className="scientist-section__index">05</p>
          <h2 id="spirit-heading">精神印记</h2>
          {spiritStories.length > 0 ? (
            <div className="profile-spirit-grid">
              {spiritStories.map(({ story, theme }) => (
                <article key={`${story.id}-${theme.id}`}>
                  <h3>{theme.title}</h3>
                  <p>{theme.summary}</p>
                  <div className="profile-spirit-grid__story">
                    <strong>{story.title}</strong>
                    <p>{story.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="scientist-section__empty">相关主题故事持续整理中。</p>
          )}
        </div>
      </section>

      <section className="scientist-section scientist-section--legacy" aria-labelledby="legacy-heading">
        <div className="scientist-section__inner scientist-legacy">
          <div>
            <p className="scientist-section__index">06</p>
            <h2 id="legacy-heading">薪火相传</h2>
            {representativeStory ? (
              <>
                <h3>{representativeStory.title}</h3>
                <p>{representativeStory.summary}</p>
              </>
            ) : (
              <p>相关主题故事持续整理中。</p>
            )}
          </div>
          <Link className="next-scientist" to={`/scientists/${nextScientist.slug}`}>
            <span>下一位核心人物</span>
            <strong>{nextScientist.name}</strong>
          </Link>
        </div>
      </section>

      {activeArchiveId ? (
        <ArchiveViewer
          items={scientistArchives}
          initialId={activeArchiveId}
          onClose={() => setActiveArchiveId(null)}
        />
      ) : null}
    </article>
  );
}
