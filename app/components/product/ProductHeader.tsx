import {useLoaderData, useRouteLoaderData} from 'react-router';
import type {loader} from '~/routes/_store.($locale).products.$handle';
import {RootLoader} from '~/root';
import {useProductView} from './ProductView';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {getShadeOptionName} from '~/lib/shadeUrl';
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

  // Append the selected shade name to the H1 for products with a qualifying
  // shade option (e.g. "Mini Color Nail Polish Pink - 9. Lisboa"). Products
  // without a shade option (e.g. "Packaging", single-variant "Title") keep the
  // bare title, matching the client's expectation that non-shade products are
  // unchanged. The shade value is read from selectedVariant.selectedOptions
  // matched to the shade option name (never the whole variant title), so it
  // updates automatically as the customer switches shade.
  const shadeOptionName = product ? getShadeOptionName(product) : null;
  const shadeValue = shadeOptionName
    ? selectedVariant?.selectedOptions?.find(
        (o) => o.name === shadeOptionName,
      )?.value
    : undefined;
  // Guard: a shade value that duplicates the product title renders just the
  // title (dodges "Nailactan - Nailactan" duplication).
  const h1Title =
    shadeValue && shadeValue !== title ? `${title} - ${shadeValue}` : title;
  const badges = selectedVariant?.badges ?? product?.badges;
  const {yotpoReviews} = useLoaderData<typeof loader>();
  const {bottomline} = yotpoReviews ?? {};
  const productCapacity = capacity?.value?.split('(');

  return (
    (<header className={styles.root}>
      <Badges className={styles.badges} items={badges} size="lg" />
      <Heading asChild size={isDesktop ? '2xl' : 'xl'} className={styles.title}>
        <h1 data-testid="product-h1">{h1Title}</h1>
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
