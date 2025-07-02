import type {ProductFragment} from 'storefrontapi.generated';
import type {Video as VideoTypeShopify} from '@shopify/hydrogen/storefront-api-types';
import {
  SanityVideo,
  type VideoType as VideoTypeSanity,
} from '../common/SanityVideo';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {Video} from '../ui/Video';
import styles from './VideoSection.module.css';

export type VideoModuleType = {
  _type: 'videoModule';
  title: string | null;
  text: string | null;
  video: VideoTypeSanity | null;
};

export type VideoSectionType = NonNullable<
  NonNullable<NonNullable<ProductFragment['videoSection']>['reference']>
>;

function getContentType(content: VideoModuleType | VideoSectionType) {
  if ('_type' in content) {
    return {
      title: content.title ?? '',
      text: content.text ?? '',
      video: content.video,
      isSanityVideoModule: true,
    };
  } else {
    return {
      title: content?.title?.value ?? '',
      text: content?.text?.value ?? '',
      video: content.file?.reference,
      isShopifyVideoModule: true,
    };
  }
}

export function VideoSection({
  content,
}: {
  content: VideoModuleType | VideoSectionType;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {title, text, video, isSanityVideoModule, isShopifyVideoModule} =
    getContentType(content);

  if (!content) {
    return null;
  }

  return (
    <section className={styles.root}>
      <Heading asChild size={isDesktop ? '2xl' : 'xl'} className={styles.title}>
        <h2>{title}</h2>
      </Heading>
      <Text weight="light" className={styles.text}>
        {text}
      </Text>
      {isSanityVideoModule && (
        <SanityVideo
          className={styles.video}
          data={video as VideoTypeSanity}
          muted
          autoPlay
          loop
        />
      )}
      {isShopifyVideoModule && (
        <Video
          className={styles.video}
          source={video as VideoTypeShopify}
          autoPlay
          loop
          muted
        />
      )}
    </section>
  );
}
