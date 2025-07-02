import {cn} from '~/lib/utils';
import type {ImageType} from '~/components/common/SanityImage';
import {stegaClean} from '@sanity/client/stega';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {SanityImage} from '~/components/common/SanityImage';
import {Carousel} from '~/components/ui/Carousel';
import styles from './DuoMedias.module.css';

export type DuoMediasType = {
  _type: 'duoMedias';
  largeImage?: ImageType;
  smallImage?: ImageType;
  imagePosition?: 'left' | 'right' | null;
};

export function DuoMedias({data}: {data: DuoMediasType}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {imagePosition, largeImage, smallImage} = data ?? {};
  const position = stegaClean(imagePosition);
  const images = [largeImage, smallImage];
  const medias = position === 'left' ? images : images.reverse();

  return (
    <section
      className={cn('editorial-block', styles.root)}
      data-image-position={position}
    >
      {isDesktop ? (
        medias.map((media, index) => {
          const sizeLargeImage =
            '(min-width: 120rem) 58.875rem, (min-width: 64rem) 42.35vw';
          const sizeSmallImage =
            '(min-width: 120rem) 40rem, (min-width: 64rem) 27.15vw';

          return (
            <div className={styles.media} key={media?.asset?._id}>
              {media && (
                <SanityImage
                  data={media}
                  aspectRatio="4/5"
                  sizes={(() => {
                    switch (position) {
                      case 'right':
                        return index === 0 ? sizeSmallImage : sizeLargeImage;
                      case 'left':
                      default:
                        return index === 0 ? sizeLargeImage : sizeSmallImage;
                    }
                  })()}
                />
              )}
            </div>
          );
        })
      ) : (
        <Carousel
          mousewheel={{forceToAxis: true}}
          spaceBetween={8}
          slidesPerView={1.35}
          breakpoints={{
            480: {
              slidesPerView: 2.35,
            },
          }}
        >
          {medias.map((media) => (
            <div className={styles.media} key={media?.asset?._id}>
              {media && (
                <SanityImage
                  data={media}
                  aspectRatio="1/1"
                  sizes="(min-width: 30rem) 37.5vw, 66.66vw"
                />
              )}
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
}
