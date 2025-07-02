import {useMediaQuery} from '~/hooks/useMediaQuery';
import {FormattedMessage} from 'react-intl';
import {Link} from '../common/Link';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {Button, ButtonEffect} from '../ui/Button';
import {useCollectionItem} from '~/hooks/useCollectionItem';
import {ProductCard} from '../product/ProductCard';
import {Heading} from '../ui/Heading';
import {Image} from '../ui/Image';
import {Carousel} from '../ui/Carousel';
import styles from './FocusCollection.module.css';

type FocusCollectionType = {
  _type: 'focusCollection';
  collection: {
    handle: string | null;
  } | null;
};

export function FocusCollection({data}: {data: FocusCollectionType}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {handle} = data?.collection ?? {};
  const pathWithLocale = usePathWithLocale(`/collections/${handle}`);
  const {data: collection} = useCollectionItem(handle!, {first: 8});
  const {title, products, image} = collection ?? {};

  if (!data || !products) {
    return null;
  }

  return (
    <section className={styles.root}>
      <div className={styles['image-wrapper']}>
        <div className={styles.infos}>
          <Heading size={isDesktop ? '2xl' : 'xl'}>{title}</Heading>
          <Button theme="ghost" asChild>
            <Link to={pathWithLocale}>
              <ButtonEffect>
                <FormattedMessage id="all_products" />
              </ButtonEffect>
            </Link>
          </Button>
        </div>
        {image && (
          <Image
            className={styles.image}
            data={image!}
            aspectRatio={isDesktop ? '520/622' : '1/1'}
            sizes="(min-width: 120rem) 52.5rem, (min-width: 64rem) 40vw, 90vw"
          />
        )}
      </div>
      {isDesktop ? (
        <div className={styles.products}>
          {products?.nodes.map((product) => (
            <ProductCard
              handle={product.handle}
              initialData={product}
              key={product.id}
            />
          ))}
        </div>
      ) : (
        <Carousel
          mousewheel={{forceToAxis: true}}
          slidesPerView={1}
          spaceBetween={8}
          className={styles.carousel}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
          }}
        >
          {products?.nodes.map((product) => (
            <ProductCard
              variant="row"
              handle={product.handle}
              initialData={product}
              key={product.id}
              className={styles.card}
            />
          ))}
        </Carousel>
      )}
    </section>
  );
}
