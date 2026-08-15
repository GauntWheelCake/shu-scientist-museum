import { type JSX } from 'react';
import { getPageMeta } from '../app/site-meta';
import { Link } from 'react-router-dom';
import { PageIntro } from '../components/common/PageIntro';
import { TimelineLine } from '../components/motion/TimelineLine';
import { events } from '../content/events';
import { scientists } from '../content/scientists';
import type { TimelineEvent } from '../content/types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function eventYear(event: TimelineEvent): number {
  const match = event.dateLabel.match(/\d{4}/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function sortedEvents(source: TimelineEvent[]): TimelineEvent[] {
  return source
    .map((event, sourceIndex) => ({ event, sourceIndex }))
    .sort(
      (left, right) =>
        eventYear(left.event) - eventYear(right.event) ||
        left.sourceIndex - right.sourceIndex,
    )
    .map(({ event }) => event);
}

export function Timeline(): JSX.Element {
  useDocumentTitle(getPageMeta('/timeline'));
  const orderedEvents = sortedEvents(events);

  return (
    <>
      <PageIntro
        eyebrow="时代坐标"
        title="岁月长河"
        description="沿年份阅读人物选择、科研成果与上海大学发展历程。对于“前后”等时间表述，页面保留现有材料的原始精度。"
      />
      <section
        className="museum-timeline"
        aria-labelledby="timeline-events-title"
      >
        <h2 id="timeline-events-title">人物、科研与校史节点</h2>
        <div className="museum-timeline__track">
          <TimelineLine />
          <ol className="museum-timeline__events">
            {orderedEvents.map((event) => {
              const relatedScientists = event.scientistIds
                .map((scientistId) =>
                  scientists.find((scientist) => scientist.id === scientistId),
                )
                .filter((scientist) => scientist !== undefined);

              return (
                <li key={event.id}>
                  <article className="museum-timeline__event">
                    <time>{event.dateLabel}</time>
                    <div>
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      {relatedScientists.length > 0 ? (
                        <p className="museum-timeline__people">
                          <span>关联人物</span>
                          {relatedScientists.map((scientist) => (
                            <Link
                              key={scientist.id}
                              to={`/scientists/${scientist.slug}`}
                            >
                              {scientist.name}
                            </Link>
                          ))}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
