import {cn} from '~/lib/utils';
import {SanityImage} from '~/components/common/SanityImage';
import type {ImageType} from '~/components/common/SanityImage';
import styles from './TinyImage.module.css';

export type TinyImageType = {
  _type: 'tinyImage';
  _key: string;
  image?: ImageType;
};

export function TinyImage({data}: {data: TinyImageType}) {
  const {image} = data ?? {};

  return (
    <div className={cn('editorial-block', styles.root)}>
      <SanityImage
        data={image}
        aspectRatio="1/1"
        sizes="(min-width: 64rem) 12.5rem, 10.25rem"
        style={{width: undefined}}
      />
    </div>
  );
}
