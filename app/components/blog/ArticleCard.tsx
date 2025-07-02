import type {ImageType} from '../common/SanityImage';
import {Link} from '../common/Link';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {FormattedMessage} from 'react-intl';
import {SanityImage} from '../common/SanityImage';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import styles from './ArticleCard.module.css';

export type Article =
  | {
      _id: string;
      title: string | null;
      slug: string | null;
      publishedAt: string | null;
      category: {
        title: string | null;
        slug: string | null;
      } | null;
      image: ImageType;
    }
  | null
  | undefined;

export function ArticleCard({article}: {article: Article}) {
  const {title, slug, category, image} = article ?? {};
  const pathWithLocale = usePathWithLocale(`/blog/${category?.slug}/${slug}`);

  return (
    <Link to={pathWithLocale} className={styles.root}>
      <div className={styles.content}>
        <Text asChild color="medium" size="xs" weight="light">
          <span>{category?.title}</span>
        </Text>
        <Heading asChild className={styles.title}>
          <p>{title}</p>
        </Heading>
        <Text asChild color="medium" size="xs" weight="light">
          <span>
            <FormattedMessage id="consult" />
          </span>
        </Text>
      </div>
      {image && (
        <div className={styles['image-wrapper']}>
          <SanityImage
            className={styles.image}
            data={image}
            aspectRatio="1/1"
            sizes="3.5rem"
          />
        </div>
      )}
    </Link>
  );
}
