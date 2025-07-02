import {useState, useId} from 'react';
import {cn} from '~/lib/utils';
import type {SwiperClass} from 'swiper/react';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import type {ImageType} from '~/components/common/SanityImage';
import {Carousel, CarouselNavigationButtons} from '~/components/ui/Carousel';
import {SanityImage} from '~/components/common/SanityImage';
import {SanityVideo, type VideoType} from '~/components/common/SanityVideo';
import styles from './GalleryCarousel.module.css';

export type GalleryCarouselType = {
  _type: 'galleryCarousel';
  medias?: Array<ImageType | VideoType>;
};

export function GalleryCarousel({data}: {data: GalleryCarouselType}) {
  const id = useId();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const {medias} = data ?? {};

  return (
    <section className={cn('editorial-block', styles.root)}>
      {isDesktop ? (
        <div className={styles.gallery}>
          <Carousel
            mousewheel={{forceToAxis: true}}
            effect="fade"
            className={styles.carousel}
            thumbs={{swiper: thumbsSwiper}}
            navigation={{
              prevEl: `[id="swiper-button-prev-${id}"]`,
              nextEl: `[id="swiper-button-next-${id}"]`,
            }}
          >
            {medias?.map((media) => (
              <div className={styles.slide} key={media?._key}>
                <SlideMedia
                  media={media}
                  sizes="(min-width: 120rem) 74.375rem, 59.5vw"
                  aspectRatio="4/3"
                />
              </div>
            ))}
          </Carousel>
          {medias?.length! > 1 && (
            <>
              <Carousel
                mousewheel={{forceToAxis: true}}
                spaceBetween={8}
                slidesPerView={'auto'}
                freeMode={true}
                watchSlidesProgress={true}
                onSwiper={setThumbsSwiper}
                className={styles.thumbs}
              >
                {medias?.map((media) => (
                  <div className={styles.slide} key={media?._key}>
                    <SlideMedia media={media} sizes="3rem" thumb />
                  </div>
                ))}
              </Carousel>
              <CarouselNavigationButtons className={styles.buttons} id={id} />
            </>
          )}
        </div>
      ) : (
        <Carousel
          mousewheel={{forceToAxis: true}}
          spaceBetween={8}
          slidesPerView={1.35}
          lazyPreloadPrevNext={1}
          className={styles.carousel}
          breakpoints={{
            480: {
              slidesPerView: 2.35,
              spaceBetween: 8,
            },
          }}
        >
          {medias?.map((media) => (
            <div className={styles.slide} key={media?._key}>
              <SlideMedia
                media={media}
                sizes={'(min-width: 30rem) 37.5vw, 66.66vw'}
              />
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
}

function SlideMedia({
  media,
  aspectRatio,
  sizes,
  thumb,
}: {
  media: ImageType | VideoType;
  aspectRatio?: string;
  sizes: string;
  thumb?: boolean;
}) {
  if (!media) {
    return null;
  }

  return (() => {
    switch (media?._type) {
      case 'video':
        return <SanityVideo data={media} controls={!thumb} />;
      case 'image':
      default:
        return (
          <SanityImage
            data={media as ImageType}
            aspectRatio={aspectRatio ?? '1/1'}
            sizes={sizes}
            style={{width: undefined, height: undefined}}
          />
        );
    }
  })();
}
