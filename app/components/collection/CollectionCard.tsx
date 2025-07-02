import type {CollectionItemFragment} from 'storefrontapi.generated';
import {useCollectionItem} from '~/hooks/useCollectionItem';
import type {Video as VideoType} from '@shopify/hydrogen/storefront-api-types';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Link} from '../common/Link';
import {Image} from '../ui/Image';
import {Heading} from '../ui/Heading';
import {cn} from '~/lib/utils';
import {Video} from '../ui/Video';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import styles from './CollectionCard.module.css';

export function CollectionCard({
  handle,
  initialData,
  className,
  size,
  sizes,
  variant,
}: {
  handle: string;
  initialData?: CollectionItemFragment;
  className?: string;
  size?: 'xs' | 'sm' | 'lg';
  sizes?: string;
  variant?: 'compact';
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const pathWithLocale = usePathWithLocale(`/collections/${handle}`);

  const {data: collection} = useCollectionItem(handle, undefined, {
    initialData,
  });

  const {title, image, posterVideo} = collection ?? {};

  if (!collection) {
    return null;
  }

  return (
    <Link
      to={pathWithLocale}
      className={cn(styles.root, className)}
      data-variant={variant}
      data-size={size}
    >
      <div className={styles['image-wrapper']}>
        {!posterVideo ? (
          image && (
            <Image
              className={styles.image}
              data={image!}
              aspectRatio="1/1"
              sizes={
                sizes ??
                '(min-width: 120rem) 36.625rem, (min-width: 64rem) 15.625vw, (min-width: 30rem) 37.5vw, 66.66vw'
              }
            />
          )
        ) : (
          <Video
            source={posterVideo?.reference as VideoType}
            muted
            autoPlay
            loop
          />
        )}
      </div>
      <Heading size={size ?? (isDesktop ? 'lg' : 'md')} asChild>
        <p>{title}</p>
      </Heading>
    </Link>
  );
}
