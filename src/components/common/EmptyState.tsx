import { type JSX, type ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps): JSX.Element {
  return (
    <section className="empty-state" aria-labelledby="empty-state-title">
      <span className="empty-state__marker" aria-hidden="true">
        〔 档案 〕
      </span>
      <h2 id="empty-state-title" className="empty-state__title">
        {title}
      </h2>
      <p className="empty-state__description">{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </section>
  );
}
