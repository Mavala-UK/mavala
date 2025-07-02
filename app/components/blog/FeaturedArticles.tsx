import {use} from 'react';
import { useRouteLoaderData, useLocation } from 'react-router';
import type {RootLoader} from '~/root';
import {useIntl} from 'react-intl';
import {type Article} from './ArticleCard';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {FormattedMessage} from 'react-intl';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {Link} from '../ui/Link';
import {ArticleCard} from './ArticleCard';
import styles from './FeaturedArticles.module.css';

export type ArticlesType = Article[] | null | undefined;

export function FeaturedArticles({
  relatedArticles,
}: {
  relatedArticles?: ArticlesType;
}) {
  const {formatMessage} = useIntl();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const pathWithLocale = usePathWithLocale(`/blog`);
  const {pathname} = useLocation();
  const isBlogArticle = pathname.includes('blog');
  const data = useRouteLoaderData<RootLoader>('root');
  const {featuredArticles: globalArticlesPromise} = data ?? {};

  const {
    featuredArticles: globalArticles,
    title,
    shortDescription,
  } = use(globalArticlesPromise!).data ?? {};

  const articles = relatedArticles ? relatedArticles : globalArticles;

  if (!articles) {
    return null;
  }

  return (
    <section className={styles.root}>
      <Heading className={styles.title} size={isDesktop ? '2xl' : 'xl'}>
        {isBlogArticle ? formatMessage({id: 'similar_articles'}) : title}
      </Heading>
      {!isBlogArticle && (
        <>
          <Text className={styles.text} weight="light">
            {shortDescription}
          </Text>
          <Text weight="light" asChild size="sm">
            <Link
              className={styles.link}
              to={pathWithLocale}
              variant="underline"
            >
              <FormattedMessage id="all_articles" />
            </Link>
          </Text>
        </>
      )}
      <div className={styles.articles}>
        {articles?.map((article) => (
          <ArticleCard article={article} key={article?._id} />
        ))}
      </div>
    </section>
  );
}
