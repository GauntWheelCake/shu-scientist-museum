import { type JSX } from 'react';
import type { TimelineEvent } from '../../content/types';

type ScientistTimelineProps = {
  events: TimelineEvent[];
};

export function ScientistTimeline({ events }: ScientistTimelineProps): JSX.Element {
  if (events.length === 0) {
    return <p className="scientist-section__empty">相关生平资料持续整理中。</p>;
  }

  return (
    <ol className="scientist-timeline">
      {events.map((event) => (
        <li key={event.id}>
          <time>{event.dateLabel}</time>
          <div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
