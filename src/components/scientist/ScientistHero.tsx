import { type JSX } from 'react';
import type { Scientist } from '../../content/types';
import { ResilientImage } from '../common/ResilientImage';

type ScientistHeroProps = {
  scientist: Scientist;
};

export function ScientistHero({ scientist }: ScientistHeroProps): JSX.Element {
  return (
    <section className="scientist-hero" aria-labelledby="scientist-name">
      <div className="scientist-hero__portrait">
        <ResilientImage
          src={scientist.portrait}
          alt={`${scientist.name}肖像`}
          fallbackLabel={scientist.name}
          className="scientist-hero__image"
          loading="eager"
        />
      </div>
      <div className="scientist-hero__content">
        <p className="scientist-hero__eyebrow">核心人物专题</p>
        <h1 id="scientist-name">{scientist.name}</h1>
        <h2>人物序章</h2>
        {scientist.years ? <p className="scientist-hero__years">{scientist.years}</p> : null}
        <p className="scientist-hero__identity">{scientist.identity}</p>
        <p className="scientist-hero__summary">{scientist.summary}</p>
      </div>
    </section>
  );
}
