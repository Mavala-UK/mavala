import type {ProductFragment} from 'storefrontapi.generated';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {Image} from '../ui/Image';
import styles from './BundleFeatures.module.css';

export function BundleFeatures({
  title,
  features,
}: {
  title?: string | null;
  features: ProductFragment['features'];
}) {
  const items = features?.references?.nodes;

  if (!items?.length) return null;

  return (
    <div className={styles.root}>
      {title && (
        <Heading asChild size="xs">
          <h2 className={styles.title}>{title}</h2>
        </Heading>
      )}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            {item.icon?.reference?.image && (
              <Image
                data={item.icon.reference.image}
                aspectRatio="1/1"
                sizes="2.4rem"
                className={styles.icon}
              />
            )}
            <Text size="sm">{item.text?.value}</Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
