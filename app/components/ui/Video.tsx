import { useRouteLoaderData } from 'react-router';
import type {Video} from '@shopify/hydrogen/storefront-api-types';
import type {RootLoader} from '~/root';
import {cn} from '~/lib/utils';
import styles from './Video.module.css';

export function Video({
  source,
  className,
  ...props
}: {
  source: Video;
  className?: string;
} & React.VideoHTMLAttributes<HTMLVideoElement>) {
  const {sources, alt, previewImage} = source ?? {};
  const data = useRouteLoaderData<RootLoader>('root');
  const {language} = data?.selectedLocale ?? {};

  return (
    <video
      playsInline
      poster={previewImage?.url}
      aria-label={alt ?? ''}
      className={cn(styles.root, className)}
      {...props}
    >
      {sources?.map((source) => {
        const {url, mimeType} = source ?? {};
        return <source src={`${url}#t=0.001`} type={mimeType} key={url} />;
      })}
      <track kind="captions" srcLang={language?.toLowerCase()} />
    </video>
  );
}
