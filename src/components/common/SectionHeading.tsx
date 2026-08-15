import { type JSX } from 'react';

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'start',
}: SectionHeadingProps): JSX.Element {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="section-heading__title">{title}</h2>
      {description ? <p className="section-heading__description">{description}</p> : null}
    </header>
  );
}
