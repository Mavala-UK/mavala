import { useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';

export type VideoType = {
  file: {
    asset: {
      url: string | null;
      mimeType: string | null;
    } | null;
  } | null;
  poster: {
    asset: {
      url: string | null;
    } | null;
  } | null;
  _type: 'video' | 'video-hero';
  _key: string;
};

export function SanityVideo({
  data,
  ...props
}: {
  data: VideoType;
} & React.VideoHTMLAttributes<HTMLVideoElement>) {
  const {file, poster} = data ?? {};
  const globalData = useRouteLoaderData<RootLoader>('root');
  const {language} = globalData?.selectedLocale ?? {};

  return (
    file?.asset?.url && (
      <video playsInline poster={poster?.asset?.url ?? undefined} {...props}>
        <source
          src={`${file?.asset?.url}#t=0.001`}
          type={file.asset.mimeType ?? undefined}
        />
        <track kind="captions" srcLang={language?.toLowerCase()} />
      </video>
    )
  );
}
