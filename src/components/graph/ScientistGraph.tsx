import { useEffect, useState, type JSX, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Scientist, SpiritTheme } from '../../content/types';

type ScientistGraphProps = {
  scientists: Scientist[];
  themes: SpiritTheme[];
};

type SelectedNode =
  { kind: 'scientist'; id: string } | { kind: 'theme'; id: string } | null;
type GraphView = 'graph' | 'list';

const mobileGraphQuery = '(max-width: 719px)';
const graphWidth = 960;
const graphHeight = 640;
const scientistX = 136;
const themeX = 824;

function initiallyMatchesMobileViewport(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(mobileGraphQuery).matches
  );
}

function verticalPosition(index: number, length: number): number {
  if (length <= 1) {
    return graphHeight / 2;
  }

  return 56 + index * ((graphHeight - 112) / (length - 1));
}

export function ScientistGraph({
  scientists,
  themes,
}: ScientistGraphProps): JSX.Element {
  const [matchesMobileViewport, setMatchesMobileViewport] = useState(
    initiallyMatchesMobileViewport,
  );
  const [explicitView, setExplicitView] = useState<GraphView | null>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null);
  const view: GraphView =
    explicitView ?? (matchesMobileViewport ? 'list' : 'graph');

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(mobileGraphQuery);
    const updateViewport = (event: MediaQueryListEvent): void => {
      setMatchesMobileViewport(event.matches);
    };

    setMatchesMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);
  const themeById = new Map(themes.map((theme) => [theme.id, theme]));
  const themePositions = new Map(
    themes.map((theme, index) => [
      theme.id,
      verticalPosition(index, themes.length),
    ]),
  );
  const scientistPositions = new Map(
    scientists.map((scientist, index) => [
      scientist.id,
      verticalPosition(index, scientists.length),
    ]),
  );
  const selectedScientist =
    selectedNode?.kind === 'scientist'
      ? scientists.find((scientist) => scientist.id === selectedNode.id)
      : undefined;
  const selectedTheme =
    selectedNode?.kind === 'theme'
      ? themes.find((theme) => theme.id === selectedNode.id)
      : undefined;

  const selectThemeWithKeyboard = (
    event: KeyboardEvent<SVGGElement>,
    themeId: string,
  ): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedNode({ kind: 'theme', id: themeId });
    }
  };

  const scientistIsNeighbour = (scientist: Scientist): boolean =>
    selectedNode?.kind === 'theme' &&
    scientist.spiritIds.includes(selectedNode.id);
  const themeIsNeighbour = (theme: SpiritTheme): boolean =>
    selectedNode?.kind === 'scientist' &&
    scientists
      .find((scientist) => scientist.id === selectedNode.id)
      ?.spiritIds.includes(theme.id) === true;

  return (
    <section className="scientist-graph" aria-label="人物与精神主题关系">
      <div className="graph-view-switcher" role="group" aria-label="图谱视图">
        <button
          type="button"
          aria-label="切换到图形视图"
          aria-pressed={view === 'graph'}
          onClick={() => setExplicitView('graph')}
        >
          图形视图
        </button>
        <button
          type="button"
          aria-label="切换到列表视图"
          aria-pressed={view === 'list'}
          onClick={() => setExplicitView('list')}
        >
          列表视图
        </button>
      </div>

      <div className="scientist-graph__layout">
        {view === 'graph' ? (
          <div className="scientist-graph__canvas">
            <svg
              data-testid="scientist-graph-svg"
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              role="group"
              aria-labelledby="scientist-graph-title"
              aria-describedby="scientist-graph-description"
            >
              <title id="scientist-graph-title">科学家与精神主题关系图</title>
              <desc id="scientist-graph-description">
                圆形表示人物，菱形表示精神主题。连线只表示人物数据中记录的精神主题关联。
              </desc>

              <g className="scientist-graph__edges" aria-hidden="true">
                {scientists.flatMap((scientist) =>
                  scientist.spiritIds.flatMap((themeId) => {
                    const scientistY = scientistPositions.get(scientist.id);
                    const themeY = themePositions.get(themeId);
                    if (scientistY === undefined || themeY === undefined) {
                      return [];
                    }
                    const isActive =
                      (selectedNode?.kind === 'scientist' &&
                        selectedNode.id === scientist.id) ||
                      (selectedNode?.kind === 'theme' &&
                        selectedNode.id === themeId);

                    return (
                      <line
                        key={`${scientist.id}-${themeId}`}
                        x1={scientistX + 36}
                        y1={scientistY}
                        x2={themeX - 64}
                        y2={themeY}
                        data-active={isActive}
                      />
                    );
                  }),
                )}
              </g>

              <g className="scientist-graph__scientists">
                {scientists.map((scientist) => {
                  const y = scientistPositions.get(scientist.id) ?? 0;
                  const isSelected =
                    selectedNode?.kind === 'scientist' &&
                    selectedNode.id === scientist.id;
                  return (
                    <Link
                      key={scientist.id}
                      className="graph-node graph-node--scientist"
                      to={`/scientists/${scientist.slug}`}
                      aria-label={`查看${scientist.name}人物详情`}
                      data-selected={isSelected}
                      data-neighbor={scientistIsNeighbour(scientist)}
                      data-dimmed={
                        selectedNode !== null &&
                        !isSelected &&
                        !scientistIsNeighbour(scientist)
                      }
                      onFocus={() =>
                        setSelectedNode({ kind: 'scientist', id: scientist.id })
                      }
                    >
                      <circle cx={scientistX} cy={y} r="36" />
                      <text
                        x={scientistX}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {scientist.name}
                      </text>
                    </Link>
                  );
                })}
              </g>

              <g className="scientist-graph__themes">
                {themes.map((theme) => {
                  const y = themePositions.get(theme.id) ?? 0;
                  const isSelected =
                    selectedNode?.kind === 'theme' &&
                    selectedNode.id === theme.id;
                  return (
                    <g
                      key={theme.id}
                      className="graph-node graph-node--theme"
                      role="button"
                      tabIndex={0}
                      aria-label={`选择精神主题：${theme.title}`}
                      aria-pressed={isSelected}
                      data-selected={isSelected}
                      data-neighbor={themeIsNeighbour(theme)}
                      data-dimmed={
                        selectedNode !== null &&
                        !isSelected &&
                        !themeIsNeighbour(theme)
                      }
                      onClick={() =>
                        setSelectedNode({ kind: 'theme', id: theme.id })
                      }
                      onKeyDown={(event) =>
                        selectThemeWithKeyboard(event, theme.id)
                      }
                    >
                      <polygon
                        points={`${themeX},${y - 36} ${themeX + 64},${y} ${themeX},${y + 36} ${themeX - 64},${y}`}
                      />
                      <text
                        x={themeX}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {theme.title}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            <p className="scientist-graph__legend">
              <span>● 人物</span>
              <span>◆ 精神主题</span>
            </p>
          </div>
        ) : null}

        {view === 'graph' ? (
          <aside className="graph-node-details" aria-live="polite">
            {selectedScientist ? (
              <>
                <p>人物节点</p>
                <h2>{selectedScientist.name}</h2>
                {selectedScientist.years ? (
                  <p>{selectedScientist.years}</p>
                ) : null}
                <p>{selectedScientist.identity}</p>
                <p>{selectedScientist.summary}</p>
                <Link to={`/scientists/${selectedScientist.slug}`}>
                  阅读人物详情
                </Link>
              </>
            ) : selectedTheme ? (
              <>
                <p>精神主题节点</p>
                <h2>{selectedTheme.title}</h2>
                <p>{selectedTheme.summary}</p>
                <p>
                  关联人物：
                  {scientists
                    .filter((scientist) =>
                      scientist.spiritIds.includes(selectedTheme.id),
                    )
                    .map((scientist) => scientist.name)
                    .join('、') || '现有资料中暂无明确关联人物'}
                </p>
              </>
            ) : (
              <>
                <p>节点说明</p>
                <h2>选择节点查看关系</h2>
                <p>
                  聚焦人物节点可查看简介，按回车进入人物详情；选择主题节点可高亮关联人物。
                </p>
              </>
            )}
          </aside>
        ) : null}
      </div>

      <section
        className="graph-relationships"
        aria-labelledby="graph-relationships-title"
      >
        <h2 id="graph-relationships-title">完整关系列表</h2>
        <p>
          此列表与图形使用同一组 `spiritIds` 关系，图形不可用时仍可完整阅读。
        </p>
        <ul>
          {scientists.map((scientist) => (
            <li key={scientist.id}>
              <Link to={`/scientists/${scientist.slug}`}>{scientist.name}</Link>
              <span>{scientist.identity}</span>
              <ul aria-label={`${scientist.name}关联的精神主题`}>
                {scientist.spiritIds.flatMap((themeId) => {
                  const theme = themeById.get(themeId);
                  return theme ? <li key={theme.id}>{theme.title}</li> : [];
                })}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
