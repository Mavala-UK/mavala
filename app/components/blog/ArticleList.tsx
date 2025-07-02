import {useEffect, useMemo} from 'react';
import { useLoaderData, useLocation, useNavigation, type Location } from 'react-router';
import type {loader} from '~/routes/_store.($locale).blog._index';
import {FormattedMessage} from 'react-intl';
import {ArticlesQueryResult} from 'sanity.generated';
import {ArticleCard} from './ArticleCard';
import type {Article} from './ArticleCard';
import {Button} from '../ui/Button';
import {Link} from '../common/Link';
import styles from './ArticleList.module.css';

export function ArticleList() {
  const {articles, hasNextPage} = useLoaderData<typeof loader>();
  const lastArticle = articles.data[articles.data.length - 1];
  const location = useNavigation();
  const isLoading = location.state !== 'idle';

  const {state} = useLocation() as Omit<Location, 'state'> & {
    state: {prevArticles: ArticlesQueryResult | null} | null;
  };

  const memoizedArticles = useMemo(() => {
    if (
      !globalThis?.window?.__hydrogenHydrated ||
      !state ||
      !state?.prevArticles
    ) {
      return articles.data;
    }

    return [...state.prevArticles, ...articles.data];
  }, [articles.data, state]);

  useEffect(() => {
    // Set a global variable to keep track of when the page finishes hydrating.
    // We can't use local state or a ref because it will be reset on soft navigations
    // to the page. This variable allows us to use the SSR'd data on the first render,
    // preventing hydration errors. On soft navigations, like browser back/forward
    // navigation, instead of using the SSR'd data, we use the data from location state.
    window.__hydrogenHydrated = true;
  }, []);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const isDisabled =
      event.currentTarget.getAttribute('aria-disabled') === 'true';

    if (isDisabled) {
      event.preventDefault();
    }
  };

  return (
    <section className={styles.root}>
      <ul className={styles.grid}>
        {articles.data?.map((article: Article) => (
          <li key={article?._id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <Button
          className={styles.button}
          theme="light"
          aria-busy={isLoading}
          aria-disabled={isLoading}
          onClick={handleClick}
          asChild
        >
          <Link
            to={`?lastPublishedAt=${lastArticle.publishedAt}&lastId=${lastArticle._id}`}
            state={{prevArticles: memoizedArticles}}
            preventScrollReset
            replace
          >
            <FormattedMessage id="load_more" />
          </Link>
        </Button>
      )}
    </section>
  );
}
