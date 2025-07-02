import {Image} from './Image';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {cn} from '~/lib/utils';
import styles from './ShadeCircle.module.css';

export default function ShadeCircle({
  tint,
  size = 'sm',
  className,
}: {
  tint?: ProductVariantFragment['tint'];
  size?: 'xs' | 'sm' | 'lg' | 'xl';
  className?: string;
}) {
  const {image: media, color, name} = tint?.reference ?? {};
  const image = media?.reference?.image;

  return (
    <span
      className={cn(styles.root, className)}
      data-size={size ?? ''}
      {...(size !== 'sm' && {
        style: {backgroundColor: String(color?.value)},
        'data-border':
          name?.value === 'Transparent' || color?.value === '#ffffff',
      })}
    >
      {image && (
        <Image
          className={styles.image}
          data={image}
          aspectRatio="1/1"
          sizes={(() => {
            switch (size) {
              case 'xs':
                return '0.5rem';
              case 'sm':
                return '0.75rem';
              case 'lg':
                return '2rem';
              case 'xl':
                return '3rem';
            }
          })()}
        />
      )}
    </span>
  );
}
