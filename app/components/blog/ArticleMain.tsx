import {useRef} from 'react';
import { useLoaderData, useRouteLoaderData } from 'react-router';
import type {loader} from '~/routes/_store.($locale).blog.$blogHandle.$articleHandle';
import {FormattedMessage, useIntl} from 'react-intl';
import {RootLoader} from '~/root';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {
  SidebarLayout,
  SidebarLayoutContent,
  SidebarLayoutAside,
} from '../layout/SidebarLayout';
import {Text} from '../ui/Text';
import {PageIntro} from '../common/PageIntro';
import {Link} from '../common/Link';
import {SanityImage} from '../common/SanityImage';
import {Newsletter} from '../layout/Newsletter';
import {CollectionCard} from '../collection/CollectionCard';
import {
  SummarySections,
  type ArticleSectionType,
} from '../layout/SummarySections';
import styles from './ArticleMain.module.css';

export function ArticleMain() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {formatMessage} = useIntl();
  const {isMavalaFrance} = data?.sites ?? {};
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {article} = useLoaderData<typeof loader>();
  const {category, title, intro, image, relatedCategories, sections} =
    article?.data ?? {};
  const {title: categoryTitle, slug: categorySlug} = category ?? {};
  const pathWithLocale = usePathWithLocale(`/blog/${categorySlug}`);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    <SidebarLayout className={styles.root}>
      <SidebarLayoutContent className={styles.content}>
        <Text
          uppercase
          size="2xs"
          weight="medium"
          color="medium"
          asChild
          className={styles.category}
        >
          <Link to={pathWithLocale}>{categoryTitle}</Link>
        </Text>
        <PageIntro title={title!} description={intro!} />
        {image && (
          <div className={styles.image}>
            <SanityImage
              data={image}
              aspectRatio={isDesktop ? '715/480' : '1/1'}
              sizes="(min-width: 120rem) 84.688rem, (min-width: 64rem) 55.86vw, 90vw"
            />
          </div>
        )}
        <SummarySections
          variant="accordion"
          sections={sections as ArticleSectionType[]}
          sectionRefs={sectionRefs}
          title={formatMessage({
            id: 'summary',
          })}
        />
        <SummarySections
          variant="sections"
          sections={sections as ArticleSectionType[]}
          sectionRefs={sectionRefs}
        />
      </SidebarLayoutContent>
      <SidebarLayoutAside>
        <SummarySections
          variant="list"
          sections={sections as ArticleSectionType[]}
          sectionRefs={sectionRefs}
          title={formatMessage({
            id: 'summary',
          })}
        />
        {isDesktop && (
          <>
            {relatedCategories && (
              <div>
                <Text weight="medium" asChild>
                  <strong>
                    <FormattedMessage id="related_categories" />
                  </strong>
                </Text>
                <div className={styles['related-categories']}>
                  {relatedCategories?.map(({handle}) => (
                    <CollectionCard
                      key={handle}
                      handle={handle ?? ''}
                      size="xs"
                    />
                  ))}
                </div>
              </div>
            )}
            {isMavalaFrance && <Newsletter variant="mini" />}
          </>
        )}
      </SidebarLayoutAside>
    </SidebarLayout>
  );
}
