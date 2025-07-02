import {useId} from 'react';
import {FormattedMessage} from 'react-intl';
import {
  DrawerTitle,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerBody,
} from '../ui/Drawer';
import {cn} from '~/lib/utils';
import {Image} from '@shopify/hydrogen';
import type {
  Media,
  MediaImage,
  Video as VideoType,
} from '@shopify/hydrogen/storefront-api-types';
import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {Carousel} from '../ui/Carousel';
import {Video} from '../ui/Video';
import styles from './ProductZoomDrawer.module.css';

export function ProductZoomDrawer({
  medias,
  initialSlide = 0,
}: {
  medias: Media[];
  initialSlide: number;
}) {
  const id = useId();

  return (
    <DrawerContent animationOrigin="bottom" className={styles.content}>
      <DrawerHeader className={styles.header}>
        <VisuallyHidden asChild>
          <DrawerTitle>
            <FormattedMessage id="product_zoom" />
          </DrawerTitle>
        </VisuallyHidden>
        <DrawerClose />
      </DrawerHeader>
      <DrawerBody className={styles.body}>
        <button
          type="button"
          className={cn(styles.button, 'swiper-button-prev')}
          id={id ? `swiper-button-prev-${id}` : undefined}
        />
        <Carousel
          mousewheel
          slidesPerView={1}
          pagination={{clickable: true}}
          initialSlide={initialSlide}
          lazyPreloadPrevNext={1}
          navigation={{
            prevEl: `[id="swiper-button-prev-${id}"]`,
            nextEl: `[id="swiper-button-next-${id}"]`,
          }}
        >
          {medias?.map((media, index) => {
            switch (media.mediaContentType) {
              case 'VIDEO':
                const {sources} = media as VideoType;

                return (
                  <Video
                    key={`${media.id}-${index + 1}`}
                    source={media as VideoType}
                    controls
                    style={{
                      aspectRatio: `${sources[0].width}/${sources[0].height}`,
                    }}
                  />
                );
              case 'IMAGE':
              default:
                const {image} = media as MediaImage;

                return (
                  <Image
                    key={`${media.id}-${index + 1}`}
                    data={image!}
                    aspectRatio={`${image?.width}/${image?.height}`}
                    sizes="80vh"
                    style={{
                      width: undefined,
                    }}
                  />
                );
            }
          })}
        </Carousel>
        <button
          type="button"
          className={cn(styles.button, 'swiper-button-next')}
          id={id ? `swiper-button-next-${id}` : undefined}
        />
      </DrawerBody>
    </DrawerContent>
  );
}
