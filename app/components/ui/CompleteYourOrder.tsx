import {useId} from 'react';
import {cn} from '~/lib/utils';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ProductCard} from '../product/ProductCard';
import {FormattedMessage} from 'react-intl';
import {Carousel, CarouselNavigationButtons} from '../ui/Carousel';
import {Text} from '../ui/Text';
import styles from './CompleteYourOrder.module.css';

export function CompleteYourOrder({
  products,
  variant,
  className,
  title,
}: {
  products: ProductItemFragment[];
  variant?: 'page' | 'cart';
  className?: string;
  title?: React.ReactNode;
}) {
  const id = useId();

  const slidesPerView = (slidesPerView: number) =>
    variant === 'cart' ? (products.length === 1 ? 1 : slidesPerView) : 1;

  if (!products?.length) {
    return null;
  }

  return (
    <section className={cn(styles.root, className)} data-variant={variant}>
      <Text
        uppercase
        asChild
        weight="medium"
        size="2xs"
        className={styles.title}
      >
        <h2>
          {title ?? <FormattedMessage id="complete_your_order" />}
        </h2>
      </Text>
      <CarouselNavigationButtons className={styles.buttons} id={id} size="sm" />
      <Carousel
        mousewheel={{forceToAxis: true}}
        className={styles.carousel}
        slidesPerView={slidesPerView(1.2)}
        spaceBetween={8}
        lazyPreloadPrevNext={1}
        navigation={{
          prevEl: `[id="swiper-button-prev-${id}"]`,
          nextEl: `[id="swiper-button-next-${id}"]`,
        }}
        breakpoints={{
          768: {
            slidesPerView: slidesPerView(2.2),
          },
          1024: {
            slidesPerView: slidesPerView(1.2),
            spaceBetween: variant === 'cart' ? 8 : 0,
          },
        }}
      >
        {products?.map((product) => (
          <ProductCard
            variant="strip"
            key={product.id}
            initialData={product}
            handle={product.handle}
            {...(variant === 'cart' && {
              size: 'sm',
            })}
          />
        ))}
      </Carousel>
    </section>
  );
}
