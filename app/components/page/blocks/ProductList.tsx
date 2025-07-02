import {useId} from 'react';
import {cn} from '~/lib/utils';
import { useLocation } from 'react-router';
import {Carousel, CarouselNavigationButtons} from '~/components/ui/Carousel';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {ProductCard} from '~/components/product/ProductCard';
import styles from './ProductList.module.css';

export type ProductListType = {
  _type: 'productList';
  products: Array<{
    _id: string;
    slug: string | null;
  }> | null;
};

export function ProductList({data}: {data: ProductListType}) {
  const id = useId();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {pathname} = useLocation();
  const {products} = data ?? {};

  if (!products || !products.length) {
    return null;
  }

  return (
    <section className={cn('editorial-block', styles.root)}>
      <Carousel
        mousewheel={{forceToAxis: true}}
        slidesPerView={1}
        spaceBetween={10}
        lazyPreloadPrevNext={2}
        navigation={{
          prevEl: `[id="swiper-button-prev-${id}"]`,
          nextEl: `[id="swiper-button-next-${id}"]`,
        }}
        breakpoints={{
          1024: {
            slidesPerView: products.length > 1 ? 1.35 : 1,
          },
        }}
      >
        {products?.map((product) => (
          <ProductCard
            variant="strip"
            key={product._id}
            handle={product?.slug!}
            {...(pathname.includes('pages') && {theme: 'light'})}
          />
        ))}
      </Carousel>
      {products.length > 1 && isDesktop && (
        <CarouselNavigationButtons className={styles.buttons} id={id} />
      )}
    </section>
  );
}
