import type {PageQueryResult} from 'sanity.generated';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {PortableText} from '../common/PortableText';
import styles from './PageContent.module.css';

export function PageContent({page}: {page: PageQueryResult}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {title, introTitle, introDescription, content} = page ?? {};

  if (!content) {
    return null;
  }
  return (
    <article className={styles.root}>
      <Heading size={isDesktop ? '3xl' : 'xl'} className={styles.title} asChild>
        <h1>{introTitle ?? title}</h1>
      </Heading>
      {introDescription && (
        <Text
          size={isDesktop ? 'lg' : 'md'}
          className={styles.description}
          weight="light"
        >
          {introDescription}
        </Text>
      )}
      <PortableText className={styles.content} value={content!} />
    </article>
  );
}
