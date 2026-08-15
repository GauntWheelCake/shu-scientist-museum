import { useState, type JSX } from 'react';
import { withBasePath } from '../../app/publicAsset';

type ResilientImageProps = {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export function ResilientImage(props: ResilientImageProps): JSX.Element {
  return <SourceImage key={props.src} {...props} />;
}

function SourceImage({
  src,
  alt,
  fallbackLabel,
  className,
  loading = 'lazy',
}: ResilientImageProps): JSX.Element {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={className ? `${className} resilient-image--fallback` : 'resilient-image--fallback'}
        role="img"
        aria-label={`${alt}暂缺`}
      >
        <span aria-hidden="true">{fallbackLabel.slice(0, 1)}</span>
        <small aria-hidden="true">影像整理中</small>
      </span>
    );
  }

  return (
    <img
      className={className}
      src={withBasePath(src)}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
