import { type JSX } from 'react';
import { getPageMeta } from '../app/site-meta';
import { Link, useSearchParams } from 'react-router-dom';
import { PageIntro } from '../components/common/PageIntro';
import { scientists, stories } from '../content/scientists';
import { spiritThemes } from '../content/spirit-themes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Spirit(): JSX.Element {
  useDocumentTitle(getPageMeta('/spirit'));
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTheme = searchParams.get('theme');
  const selectedTheme =
    spiritThemes.find((theme) => theme.id === requestedTheme) ??
    spiritThemes[0];
  const relatedScientists = scientists.filter((scientist) =>
    scientist.spiritIds.includes(selectedTheme.id),
  );
  const relatedStories = stories.filter((story) =>
    story.spiritIds.includes(selectedTheme.id),
  );

  const selectTheme = (themeId: string): void => {
    const next = new URLSearchParams(searchParams);
    next.set('theme', themeId);
    setSearchParams(next);
  };

  return (
    <>
      <PageIntro
        eyebrow="精神坐标"
        title="精神谱系"
        description="从六个精神主题反查人物与故事；每一条关联都来自现有结构化材料。"
      />
      <section
        className="spirit-explorer"
        aria-labelledby="spirit-explorer-title"
      >
        <h2 id="spirit-explorer-title">选择精神主题</h2>
        <div className="spirit-switcher" role="group" aria-label="精神主题">
          {spiritThemes.map((theme, index) => (
            <button
              key={theme.id}
              type="button"
              aria-pressed={theme.id === selectedTheme.id}
              onClick={() => selectTheme(theme.id)}
            >
              <span aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {theme.title}
            </button>
          ))}
        </div>

        <article className="spirit-profile">
          <header className="spirit-profile__definition">
            <p>主题释义</p>
            <h2>{selectedTheme.title}</h2>
            <p>{selectedTheme.summary}</p>
            <ul aria-label="主题关键词">
              {selectedTheme.keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </header>

          <section
            className="spirit-profile__people"
            aria-labelledby="related-people-title"
          >
            <h3 id="related-people-title">关联人物</h3>
            <ul>
              {relatedScientists.map((scientist) => (
                <li key={scientist.id}>
                  <Link to={`/scientists/${scientist.slug}`}>
                    {scientist.name}
                  </Link>
                  <span>{scientist.identity}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="spirit-profile__stories"
            aria-labelledby="related-stories-title"
          >
            <h3 id="related-stories-title">真实故事</h3>
            {relatedStories.length > 0 ? (
              <ul>
                {relatedStories.map((story) => (
                  <li key={story.id}>
                    <h4>{story.title}</h4>
                    <p>{story.summary}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="spirit-profile__empty">
                该主题的故事材料仍在持续整理中。
              </p>
            )}
          </section>
        </article>
      </section>
    </>
  );
}
