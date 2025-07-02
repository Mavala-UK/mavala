import {cn} from '~/lib/utils';
import type {ImageType} from '~/components/common/SanityImage';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {stegaClean} from '@sanity/client/stega';
import {Text} from '~/components/ui/Text';
import {Carousel} from '~/components/ui/Carousel';
import {Heading} from '~/components/ui/Heading';
import {SanityImage} from '~/components/common/SanityImage';
import styles from './ArgumentsCarousel.module.css';

export type ArgumentsCarouselType = {
  _type: 'argumentsCarousel';
  subtitle?: string | null;
  slides?: Array<{
    image?: ImageType;
    title?: string | null;
    text?: string | null;
    sizeText?: 'large' | 'small';
    _key: string;
  }>;
};

export function ArgumentsCarousel({data}: {data: ArgumentsCarouselType}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {subtitle, slides} = data ?? {};

  return (
    <section className={cn('editorial-block', styles.root)}>
      <Carousel
        mousewheel={{forceToAxis: true}}
        effect="fade"
        slidesPerView="auto"
        loop={slides?.length! > 1}
        pagination={{clickable: true}}
        autoplay={{delay: 4000}}
      >
        {slides?.map((slide) => {
          const {image, title, text, sizeText} = slide ?? {};
          const size = stegaClean(sizeText);

          return (
            <div className={styles.slide} key={slide._key}>
              <div className={styles['image-wrapper']}>
                {image && (
                  <SanityImage
                    data={image}
                    aspectRatio={isDesktop ? '1/1' : '16/10'}
                    sizes="(min-width: 120rem) 46.625rem, (min-width: 64rem) 37.5vw, 90vw"
                  />
                )}
              </div>
              <div className={styles.content}>
                <Text color="accent" uppercase weight="medium" size="2xs">
                  {subtitle}
                </Text>
                <div className={styles.texts} data-size={size}>
                  <Heading size={isDesktop ? 'lg' : 'md'} asChild>
                    <p>{title}</p>
                  </Heading>
                  <Heading
                    asChild
                    size={size === 'large' && isDesktop ? 'lg' : 'md'}
                  >
                    <Text color="medium" weight="light">
                      {text}
                    </Text>
                  </Heading>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </section>
  );
}
