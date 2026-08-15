import { type JSX } from 'react';
import { getPageMeta } from '../app/site-meta';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { PageIntro } from '../components/common/PageIntro';
import { ScientistCard } from '../components/scientist/ScientistCard';
import { scientists } from '../content/scientists';
import { spiritThemes } from '../content/spirit-themes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const fields = Array.from(new Set(scientists.flatMap((scientist) => scientist.fields))).sort((a, b) =>
  a.localeCompare(b, 'zh-CN'),
);

export function Gallery(): JSX.Element {
  useDocumentTitle(getPageMeta('/scientists'));
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedField = searchParams.get('field') ?? '';
  const requestedSpirit = searchParams.get('spirit') ?? '';
  const selectedField = fields.includes(requestedField) ? requestedField : '';
  const selectedSpirit = spiritThemes.some((theme) => theme.id === requestedSpirit)
    ? requestedSpirit
    : '';

  const filteredScientists = scientists.filter(
    (scientist) =>
      (!selectedField || scientist.fields.includes(selectedField)) &&
      (!selectedSpirit || scientist.spiritIds.includes(selectedSpirit)),
  );

  const setFilter = (key: 'field' | 'spirit', value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next);
  };

  const resetFilters = () => setSearchParams({});

  return (
    <>
      <PageIntro
        eyebrow="人物档案"
        title="前辈群像"
        description="循着研究领域与精神关键词，阅读上海大学科学工作者回应时代课题的选择与实践。"
      />
      <section className="gallery-section" aria-labelledby="gallery-results-title">
        <div className="gallery-filters" aria-label="人物筛选">
          <label>
            <span>学科领域</span>
            <select value={selectedField} onChange={(event) => setFilter('field', event.target.value)}>
              <option value="">全部领域</option>
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>精神关键词</span>
            <select
              value={selectedSpirit}
              onChange={(event) => setFilter('spirit', event.target.value)}
            >
              <option value="">全部精神</option>
              {spiritThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="gallery-results-heading">
          <h2 id="gallery-results-title">人物档案</h2>
          <p aria-live="polite">当前展示 {filteredScientists.length} 位</p>
        </div>

        {filteredScientists.length > 0 ? (
          <div className="scientist-grid">
            {filteredScientists.map((scientist) => (
              <ScientistCard key={scientist.id} scientist={scientist} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="未找到符合条件的人物"
            description="可以调整筛选条件，或重置后浏览全部人物档案。"
            action={
              <button className="gallery-reset" type="button" onClick={resetFilters}>
                重置筛选
              </button>
            }
          />
        )}
      </section>
    </>
  );
}
