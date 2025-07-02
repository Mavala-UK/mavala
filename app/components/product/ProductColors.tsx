import {useId} from 'react';
import {useProductView} from './ProductView';
import {FormattedMessage} from 'react-intl';
import {cn, sortColorsByName} from '~/lib/utils';
import {Text} from '../ui/Text';
import {Carousel, CarouselWrapperButton} from '../ui/Carousel';
import {Color} from '../ui/Color';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import type {MainColorFragment} from 'storefrontapi.generated';
import {Link} from '../common/Link';
import styles from './ProductColors.module.css';

export function ProductColors({className}: {className?: string}) {
  const id = useId();
  const {product} = useProductView();

  const productsColor = sortColorsByName(
    product?.associatedProducts?.references?.nodes!,
  )?.filter((productColor) => productColor?.mainColor);

  if (!productsColor?.length) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <Text asChild uppercase size="2xs" weight="medium">
        <h2>
          <FormattedMessage id="main_color" />
        </h2>
      </Text>
      <CarouselWrapperButton id={id}>
        <Carousel
          mousewheel
          slidesPerView="auto"
          spaceBetween={8}
          slideToClickedSlide
          navigation={{
            nextEl: `[id="swiper-button-next-${id}"]`,
          }}
          breakpoints={{
            1024: {
              enabled: false,
              spaceBetween: 0,
            },
          }}
        >
          {productsColor?.map((productColor) => (
            <LinkColor productColor={productColor} key={productColor.id} />
          ))}
        </Carousel>
      </CarouselWrapperButton>
    </div>
  );
}

function LinkColor({productColor}: {productColor: MainColorFragment}) {
  const pathWithLocale = usePathWithLocale(`/products/${productColor?.handle}`);
  const {product} = useProductView();
  const {mainColor} = product ?? {};

  return (
    <Link
      to={pathWithLocale}
      className={styles['link-color']}
      data-active={
        productColor?.mainColor?.reference?.id === mainColor?.reference?.id
      }
    >
      <Color productColor={productColor} className={styles.color} />
    </Link>
  );
}
