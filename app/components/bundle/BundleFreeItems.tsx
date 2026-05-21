import {Sparkles} from '../icons/accordion/Sparkles';
import {Image} from '../ui/Image';
import {Text} from '../ui/Text';
import {Link} from '../ui/Link';
import type {ProductItemFragment} from 'storefrontapi.generated';
import styles from './BundleFreeItems.module.css';

type FreeItem = NonNullable<
  NonNullable<ProductItemFragment['freeItems']>['references']
>['nodes'][0];

export function BundleFreeItems({items}: {items: FreeItem[]}) {
  if (!items?.length) return null;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.icon}>
          <Sparkles />
        </span>
        <Text weight="medium" size="sm" className={styles.title}>
          Includes free
        </Text>
      </div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            {item.featuredImage && (
              <Image
                data={item.featuredImage}
                aspectRatio="1/1"
                sizes="4rem"
                className={styles.thumbnail}
              />
            )}
            <Text size="xs" className={styles.itemName}>
              {item.title}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
