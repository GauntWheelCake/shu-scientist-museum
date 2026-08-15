import { type JSX, type ReactNode } from 'react';

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: PageIntroProps): JSX.Element {
  return (
    <header className="page-intro">
      <div className="page-intro__inner">
        {eyebrow ? <p className="page-intro__eyebrow">{eyebrow}</p> : null}
        <h1 className="page-intro__title">{title}</h1>
        {description ? <p className="page-intro__description">{description}</p> : null}
        {children ? <div className="page-intro__content">{children}</div> : null}
      </div>
    </header>
  );
}
