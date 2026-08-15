import { type JSX } from 'react';
import { Link } from 'react-router-dom';
import type { Scientist } from '../../content/types';
import { ResilientImage } from '../common/ResilientImage';

type ScientistCardProps = {
  scientist: Scientist;
};

export function ScientistCard({ scientist }: ScientistCardProps): JSX.Element {
  return (
    <article className="scientist-card">
      <div className="scientist-card__portrait">
        <ResilientImage
          src={scientist.portrait}
          alt={`${scientist.name}肖像`}
          fallbackLabel={scientist.name}
          className="scientist-card__image"
        />
        <span className="scientist-card__number" aria-hidden="true">
          {scientist.featured ? '核心专题' : '前辈群像'}
        </span>
      </div>
      <div className="scientist-card__body">
        <h2>
          <Link to={`/scientists/${scientist.slug}`}>{scientist.name}</Link>
        </h2>
        {scientist.years ? <p className="scientist-card__years">{scientist.years}</p> : null}
        <p className="scientist-card__identity">{scientist.identity}</p>
        <p className="scientist-card__summary">{scientist.summary}</p>
        <ul className="scientist-card__fields" aria-label={`${scientist.name}的研究领域`}>
          {scientist.fields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
