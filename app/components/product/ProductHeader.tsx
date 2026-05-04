import { useLoaderData, useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';
import {useIntl} from 'react-intl';
import {type loader} from '~/routes/_store.($locale).products.$handle';
import {useProductView} from './ProductView';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Badges} from '../ui/Badges';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {Link} from '../ui/Link';
import {StarBold} from '../icons/StarBold';
import styles from './ProductHeader.module.css';

export function ProductHeader() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {isMavalaCorporate} = data?.sites ?? {};
  const {formatMessage} = useIntl();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {product, selectedVariant} = useProductView();
  const {title, capacity} = product ?? {};
  const badges = selectedVariant?.badges ?? product?.badges;
  const productCapacity = capacity?.value?.split('(');
  const {yotpoReviews} = useLoaderData<typeof loader>();
  const {bottomline} = yotpoReviews ?? {};

  return (
    (<header className={styles.root}>
      <Badges className={styles.badges} items={badges} size="lg" />
      <Heading asChild size={isDesktop ? '2xl' : 'xl'} className={styles.title}>
        <h1>{title}</h1>
      </Heading>
      {capacity && (
        <div className={styles.left}>
          <Text size="sm">{productCapacity?.[0]}</Text>
          {productCapacity?.[1] && (
            <Text asChild color="medium" size="3xs">
              <span>{`(${productCapacity?.[1]?.replace(/\)/g, '')})`}</span>
            </Text>
          )}
        </div>
      )}
      {!isMavalaCorporate && (
        <Text size="sm" className={capacity ? styles.right : styles.left}>
          <StarBold />
          <Link to={`#reviews`}>
            {bottomline?.average_score} - {bottomline?.total_review}{' '}
            {` ${formatMessage({id: 'reviews'})}`}
          </Link>
        </Text>
      )}
    </header>)
  );
}
