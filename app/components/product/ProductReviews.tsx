import {useIntl} from 'react-intl';
import type {ProductFragment} from 'storefrontapi.generated';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {FormattedMessage} from 'react-intl';
import {type loader} from '~/routes/_store.($locale).products.$handle';
import { useLoaderData } from 'react-router';
import type {YotpoReview} from '~/lib/types';
import {Review} from '../reviews/Review';
import {StarBold} from '../icons/StarBold';
import {Carousel} from '../ui/Carousel';
import {Image} from '../ui/Image';
import {Heading} from '../ui/Heading';
import styles from './ProductReviews.module.css';

export function ProductReviews({product}: {product: ProductFragment}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {formatMessage} = useIntl();
  const {yotpoReviews} = useLoaderData<typeof loader>();
  const {bottomline, reviews} = yotpoReviews ?? {};
  const {featuredImage} = product;

  if (!bottomline?.total_review) return null;

  const groupedReviews = reviews?.reduce(
    (acc: YotpoReview[][], review, index) => {
      if (index % 3 === 0) acc.push([]);
      acc[acc.length - 1].push(review);
      return acc;
    },
    [],
  );

  return (
    <section className={styles.root} id="reviews">
      <div className={styles.header}>
        <Heading className={styles.title} size={isDesktop ? '2xl' : 'xl'}>
          <FormattedMessage id="reviews_title" />
        </Heading>
        <div className={styles['rating-header']}>
          <span>{product.title}</span>
          <div className={styles.rating}>
            <StarBold />
            <p className={styles['rating-container']}>
              <span className={styles['rating-value']}>
                {bottomline?.average_score}
              </span>{' '}
              <span className={styles['rating-count']}>
                ({bottomline?.total_review}{' '}
                {` ${formatMessage({id: 'reviews'})}`})
              </span>
            </p>
          </div>
        </div>
        {isDesktop && featuredImage && (
          <Image
            className={styles.image}
            data={featuredImage}
            aspectRatio="1/1"
            style={{width: undefined}}
            sizes={'25vw'}
          />
        )}
      </div>
      <div className={styles.reviews}>
        <Carousel
          className={styles['reviews-carousel']}
          pagination={{
            clickable: true,
            renderBullet(index, className) {
              return `<span class=${className}>${index + 1}</span>`;
            },
          }}
          slidesPerView={1}
          spaceBetween={16}
        >
          {groupedReviews?.map((group, index) => (
            <div key={index} className={styles['reviews-group']}>
              {group?.map((review) => (
                <Review key={review.id} review={review} />
              ))}
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
