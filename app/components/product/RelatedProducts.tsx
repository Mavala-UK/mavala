import type {ProductItemFragment} from 'storefrontapi.generated';
import {FormattedMessage} from 'react-intl';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Heading} from '../ui/Heading';
import {Carousel} from '../ui/Carousel';
import {ProductCard} from './ProductCard';
import styles from './RelatedProducts.module.css';

export function RelatedProducts({products}: {products: ProductItemFragment[]}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  if (!products || products?.length === 0) {
    return null;
  }

  return (
    <section className={styles.root}>
      <Heading size={isDesktop ? '2xl' : 'xl'}>
        <FormattedMessage id="similar_products" />
      </Heading>
      <Carousel
        mousewheel={{forceToAxis: true}}
        className={styles.carousel}
        navigation
        variant="product"
        slidesPerView={2}
        spaceBetween={8}
        breakpoints={{
          768: {
            slidesPerView: 3,
            spaceBetween: 8,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
        }}
      >
        {products?.map((product) => (
          <ProductCard
            handle={product.handle}
            initialData={product}
            key={product.id}
          />
        ))}
      </Carousel>
    </section>
  );
}
