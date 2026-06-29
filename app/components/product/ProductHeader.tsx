import {useLoaderData, useRouteLoaderData} from 'react-router';
import type {loader} from '~/routes/_store.($locale).products.$handle';
import {RootLoader} from '~/root';
import {useProductView} from './ProductView';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Badges} from '../ui/Badges';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import styles from './ProductHeader.module.css';

export function ProductHeader() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {isMavalaCorporate} = data?.sites ?? {};
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {product, selectedVariant} = useProductView();
  const {title, capacity} = product ?? {};
  const badges = selectedVariant?.badges ?? product?.badges;
  const {yotpoReviews} = useLoaderData<typeof loader>();
  const {bottomline} = yotpoReviews ?? {};
  const productCapacity = capacity?.value?.split('(');

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
      {!isMavalaCorporate && bottomline?.total_review ? (
        <div
          className="yotpo-widget-instance"
          data-yotpo-instance-id="1213609"
          data-yotpo-product-id={product?.id?.split('/').pop()}
          data-yotpo-cart-product-id={product?.id?.split('/').pop()}
          data-yotpo-section-id="product"
        />
      ) : null}
    </header>)
  );
}
