import { type JSX } from 'react';
import { Link } from 'react-router-dom';
import { getPageMeta } from '../app/site-meta';
import { SectionHeading } from '../components/common/SectionHeading';
import { CountUp } from '../components/motion/CountUp';
import { Reveal } from '../components/motion/Reveal';
import { TimelineLine } from '../components/motion/TimelineLine';
import { activities } from '../content/activities';
import { events } from '../content/events';
import { media } from '../content/media';
import { scientists } from '../content/scientists';
import { spiritThemes } from '../content/spirit-themes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const guideItems = [
  { to: '/scientists', index: '01', title: '前辈群像', description: '从人物专题走近科学选择。' },
  { to: '/timeline', index: '02', title: '岁月长河', description: '在时间坐标中理解科技报国。' },
  { to: '/spirit', index: '03', title: '精神谱系', description: '从真实事迹辨认六类精神。' },
  { to: '/graph', index: '04', title: '科学家图谱', description: '沿人物、事件与精神关系继续探索。' },
  { to: '/footprints', index: '05', title: '精神足迹', description: '了解社会实践的计划与进展。' },
  { to: '/media', index: '06', title: '影音档案', description: '查看已核实发布与征集中的资料。' },
] as const;

export function Home(): JSX.Element {
  useDocumentTitle(getPageMeta('/'));
  const featuredScientists = scientists.filter((scientist) => scientist.featured).slice(0, 3);
  const selectedEvents = events.slice(0, 4);
  const plannedActivities = activities.filter((activity) => activity.status === 'planned');
  const completedActivities = activities.filter((activity) => activity.status === 'completed');
  const collectingMedia = media.filter((item) => item.status === 'collecting');

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__archive-mark" aria-hidden="true">
          SHU · SCIENTIST · ARCHIVE
        </div>
        <div className="home-hero__inner site-container">
          <Reveal>
            <p className="home-hero__eyebrow">上海大学科学家精神数字展馆</p>
            <h1 id="home-hero-title" className="home-hero__title">
              追寻前辈榜样，筑梦科技自立自强
            </h1>
            <p className="home-hero__lead">
              从一份档案、一个选择、一段攻坚历程出发，读懂科学家如何把个人志业写进国家需要。
            </p>
            <div className="home-hero__actions">
              <Link className="home-button home-button--light" to="/scientists">
                走近前辈
              </Link>
              <Link className="home-button home-button--outline" to="/about">
                了解项目
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="home-section home-section--raised" aria-labelledby="featured-title">
        <div className="site-container">
          <Reveal>
            <SectionHeading
              id="featured-title"
              eyebrow="典藏人物"
              title="核心人物"
              description="从三位前辈的科研与育人历程，进入上海大学科学家精神的叙事现场。"
            />
          </Reveal>
          <div className="featured-grid">
            {featuredScientists.map((scientist, index) => (
              <Reveal key={scientist.id} delay={index * 80}>
                <article className="featured-card">
                  <p className="featured-card__index">人物档案 · 0{index + 1}</p>
                  <div className="featured-card__monogram" aria-hidden="true">
                    {scientist.name.slice(0, 1)}
                  </div>
                  <h3>{scientist.name}</h3>
                  {scientist.years ? <p className="featured-card__years">{scientist.years}</p> : null}
                  <p className="featured-card__identity">{scientist.identity}</p>
                  <p className="featured-card__summary">{scientist.summary}</p>
                  <Link
                    className="featured-card__link"
                    to={`/scientists/${scientist.slug}`}
                    aria-label={`走近${scientist.name}专题`}
                  >
                    走近{scientist.name}
                    <span aria-hidden="true"> →</span>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="home-facts" role="group" aria-label="已核实展馆数据">
            <div>
              <CountUp value={featuredScientists.length} />
              <span>位核心人物</span>
            </div>
            <div>
              <CountUp value={events.length} />
              <span>个已核实时间节点</span>
            </div>
            <div>
              <CountUp value={spiritThemes.length} />
              <span>类精神主题</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="guide-title">
        <div className="site-container">
          <Reveal>
            <SectionHeading
              id="guide-title"
              eyebrow="参观路径"
              title="展馆导览"
              description="六个展区彼此关联，也可以从任一入口开始。"
            />
          </Reveal>
          <nav aria-label="数字展馆导览">
            <ol className="guide-grid">
              {guideItems.map((item, index) => (
                <li key={item.to}>
                  <Reveal delay={index * 48}>
                    <Link className="guide-card" to={item.to}>
                      <span className="guide-card__index">{item.index}</span>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <section className="home-section home-section--ink" aria-labelledby="timeline-title">
        <div className="site-container">
          <Reveal>
            <SectionHeading
              id="timeline-title"
              eyebrow="精选时间轴"
              title="岁月长河"
              description="以已核实事件为坐标，回看科学选择如何回应时代命题。"
            />
          </Reveal>
          <div className="home-timeline">
            <TimelineLine />
            <ol className="home-timeline__list">
              {selectedEvents.map((event, index) => (
                <li key={event.id}>
                  <Reveal delay={index * 72}>
                    <article className="timeline-event">
                      <time>{event.dateLabel}</time>
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
          <Link className="home-text-link home-text-link--light" to="/timeline">
            展开完整时间轴 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="home-section" aria-labelledby="spirit-title">
        <div className="site-container">
          <Reveal>
            <SectionHeading
              id="spirit-title"
              eyebrow="价值坐标"
              title="精神谱系"
              description="六类精神不是抽象口号，而是在每一次抉择、求证、协作与传承中留下的行动印记。"
            />
          </Reveal>
          <div className="spirit-grid">
            {spiritThemes.map((theme, index) => (
              <Reveal key={theme.id} delay={index * 48}>
                <article className="spirit-card">
                  <span className="spirit-card__number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{theme.title}</h3>
                  <p>{theme.summary}</p>
                  <p className="spirit-card__keywords">{theme.keywords.join(' · ')}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--graph" aria-labelledby="graph-title">
        <div className="site-container home-graph">
          <Reveal>
            <div>
              <SectionHeading id="graph-title" eyebrow="关联阅读" title="图谱入口" />
              <p className="home-graph__description">
                通过人物、科学事件与精神主题之间的关联，发现跨越年代的共同选择。
              </p>
              <p className="home-graph__note">
                图谱中的每条连线都可由文字标签识别，不需要仅凭位置或颜色判断关系。
              </p>
              <Link className="home-button home-button--brand" to="/graph">
                探索科学家图谱
              </Link>
            </div>
          </Reveal>
          <div className="graph-preview" aria-hidden="true">
            <span className="graph-preview__node graph-preview__node--person">人物</span>
            <span className="graph-preview__node graph-preview__node--event">事件</span>
            <span className="graph-preview__node graph-preview__node--spirit">精神</span>
            <span className="graph-preview__axis graph-preview__axis--one" />
            <span className="graph-preview__axis graph-preview__axis--two" />
            <span className="graph-preview__axis graph-preview__axis--three" />
          </div>
        </div>
      </section>

      <section className="home-section home-section--raised" aria-labelledby="footprints-title">
        <div className="site-container footprints-layout">
          <Reveal>
            <div>
              <SectionHeading
                id="footprints-title"
                eyebrow="社会实践"
                title="精神足迹"
                description="实践数据严格区分计划与已完成状态；尚待核验的场次与人数不作成果统计。"
              />
              <div className="activity-status" role="group" aria-label="实践活动状态">
                <div>
                  <CountUp value={plannedActivities.length} />
                  <span>计划实践路线</span>
                </div>
                <div>
                  <CountUp value={completedActivities.length} />
                  <span>已记录完成活动</span>
                </div>
              </div>
            </div>
          </Reveal>
          <ol className="activity-list">
            {activities.map((activity) => (
              <li key={activity.id}>
                <span>{activity.status === 'planned' ? '计划' : '已完成'}</span>
                <strong>{activity.title}</strong>
                <small>{activity.location}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section" aria-labelledby="media-title">
        <div className="site-container media-layout">
          <Reveal>
            <div>
              <SectionHeading
                id="media-title"
                eyebrow="资料状态"
                title="影音档案"
                description="未核实公开地址的影音资料只标注为征集中，不提供虚构的播放入口。"
              />
              <p className="media-count">
                <CountUp value={collectingMedia.length} />
                <span> 项资料征集中</span>
              </p>
              <Link className="home-text-link" to="/media">
                查看影音档案状态 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
          <ul className="media-status-list">
            {media.map((item) => (
              <li key={item.id}>
                <span>{item.kind === 'video' ? '影像' : '音频'}</span>
                <strong>{item.title}</strong>
                <small>{item.status === 'collecting' ? '资料征集中' : '已核实发布'}</small>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
