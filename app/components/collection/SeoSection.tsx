import {useId, useState, use} from 'react';
import type {SeoSectionQueryResult} from 'sanity.generated';
import {useIsomorphicLayoutEffect} from '~/hooks/useIsomorphicLayoutEffect';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Heading} from '../ui/Heading';
import {SanityImage} from '../common/SanityImage';
import {PortableText} from '../common/PortableText';
import {FormattedMessage} from 'react-intl';
import {Link} from '../ui/Link';
import type {QueryResponseInitial} from '@sanity/react-loader';
import styles from './SeoSection.module.css';

export function SeoSection({
  data,
}: {
  data: Promise<QueryResponseInitial<SeoSectionQueryResult>>;
}) {
  const id = useId();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const [isExpanded, setIsExpanded] = useState(true);
  const {title, text, image} = use(data)?.data?.seoSection ?? {};
  const excerpt = text?.slice(0, 2) ?? [];
  const isExpandable = Boolean(text && text.length > 1);

  const handleClick = () => {
    setIsExpanded(true);
  };

  useIsomorphicLayoutEffect(() => {
    setIsExpanded(false);
  }, []);

  if (!title || !text || !image) {
    return null;
  }

  return (
    <section className={styles.root}>
      <div className={styles['image-wrapper']}>
        {image && (
          <SanityImage
            data={image}
            aspectRatio="1/1"
            sizes="(min-width: 64rem) 40vw, 100vw"
          />
        )}
      </div>
      <div className={styles.content}>
        <Heading size={isDesktop ? '2xl' : 'xl'}>{title}</Heading>
        {text && (
          <PortableText
            value={isExpanded ? text : excerpt}
            id={id}
            aria-live="polite"
            variant="block"
          />
        )}
        {isExpandable && !isExpanded && (
          <Link variant="underline" asChild>
            <button type="button" aria-controls={id} onClick={handleClick}>
              <FormattedMessage id="learn_more" />
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}
