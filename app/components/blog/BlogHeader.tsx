import type { useLoaderData } from 'react-router';
import { useOutletContext } from 'react-router';
import {useIntl} from 'react-intl';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {BlogLoader} from '~/routes/_store.($locale).blog';
import {PageIntro} from '../common/PageIntro';
import {NavLinks, NavLink} from '../common/NavLinks';
import styles from './BlogHeader.module.css';

export function BlogHeader() {
  const {formatMessage} = useIntl();
  const pathWithLocale = usePathWithLocale('/blog');
  const {blog, articleCategories, allArticles} =
    useOutletContext<ReturnType<typeof useLoaderData<BlogLoader>>>();
  const {title, intro} = blog?.data ?? {};

  const categories = articleCategories.data.filter((category) =>
    allArticles.data.some(
      (article) => article?.category?.slug === category.slug,
    ),
  );

  return (
    <div className={styles.root}>
      <PageIntro
        title={title!}
        description={intro!}
        className={styles.content}
      />
      <NavLinks
        aria-label={formatMessage({
          id: 'themes',
        })}
      >
        {[
          <NavLink
            to={pathWithLocale}
            key={'themes'}
            title={formatMessage({
              id: 'see_all',
            })}
          />,
          ...categories.map((category) => {
            const {title, slug} = category ?? {};
            return (
              <CategoryLink title={title!} slug={slug!} key={category?._id} />
            );
          }),
        ]}
      </NavLinks>
    </div>
  );
}

function CategoryLink({title, slug}: {title: string; slug: string}) {
  const pathWithLocale = usePathWithLocale(`/blog/${slug}`);

  return <NavLink to={pathWithLocale} title={title} />;
}
