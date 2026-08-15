import { type JSX } from 'react';
import { getPageMeta } from '../app/site-meta';
import { ScientistGraph } from '../components/graph/ScientistGraph';
import { PageIntro } from '../components/common/PageIntro';
import { scientists } from '../content/scientists';
import { spiritThemes } from '../content/spirit-themes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Graph(): JSX.Element {
  useDocumentTitle(getPageMeta('/graph'));

  return (
    <>
      <PageIntro
        eyebrow="关系索引"
        title="科学家图谱"
        description="从人物与精神主题的明确关联出发，寻找不同学科、不同年代之间共同的精神选择。"
      />
      <div className="graph-page">
        <ScientistGraph scientists={scientists} themes={spiritThemes} />
      </div>
    </>
  );
}
