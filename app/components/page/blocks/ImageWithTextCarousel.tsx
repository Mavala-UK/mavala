import {cn} from '~/lib/utils';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import type {ImageType} from '~/components/common/SanityImage';
import {Carousel} from '~/components/ui/Carousel';
import {SanityImage} from '~/components/common/SanityImage';
import {Text} from '~/components/ui/Text';
import styles from './ImageWithTextCarousel.module.css';

export type ImageWithTextCarouselType = {
  _type: 'imageWithTextCarousel';
  slides?: Array<{
    image?: ImageType;
    text?: string | null;
    _key: string;
  }>;
};

export function ImageWithTextCarousel({
  data,
}: {
  data: ImageWithTextCarouselType;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {slides} = data ?? {};

  return (
    <section className={cn('editorial-block', styles.root)}>
      <Carousel
        mousewheel={{forceToAxis: true}}
        spaceBetween={8}
        navigation
        slidesPerView={1.35}
        variant="imageWithText"
        breakpoints={{
          480: {
            slidesPerView: 2.35,
            spaceBetween: 8,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 16,
          },
        }}
      >
        {slides?.map((slide) => {
          const {image, text} = slide ?? {};

          return (
            <div className={styles.slide} key={slide._key}>
              <div className={styles['image-wrapper']}>
                {image && (
                  <SanityImage
                    data={image}
                    aspectRatio="1/1"
                    sizes="(min-width: 120rem) 36.625rem, (min-width: 30rem) 37.5vw, 66.66vw"
                  />
                )}
              </div>
              <Text weight="light" size={isDesktop ? 'md' : 'sm'}>
                {text}
              </Text>
            </div>
          );
        })}
      </Carousel>
    </section>
  );
}
