import {useMemo, useState} from 'react';
import {cn} from '~/lib/utils';
import {useProductView} from './ProductView';
import {Image} from '../ui/Image';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Carousel} from '../ui/Carousel';
import type {
  Media,
  MediaImage,
  Video as VideoType,
} from '@shopify/hydrogen/storefront-api-types';
import {Drawer, DrawerTrigger} from '../ui/Drawer';
import {ProductZoomDrawer} from './ProductZoomDrawer';
import {Video} from '../ui/Video';
import styles from './ProductMedias.module.css';

export function ProductMedias() {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const [isProductZoomOpen, setIsProductZoomOpen] = useState<boolean>(false);
  const [isIndexClicked, setIsIndexClicked] = useState<number>(0);
  const {product, selectedVariant} = useProductView();
  const {media, variants} = product ?? {};
  const {
    image: variantPackshotImg,
    textureImg: textureImgVariant,
    galleryMedias,
  } = selectedVariant ?? {};
  const {url: selectVariantImageUrl} = variantPackshotImg ?? {};

  const medias = useMemo(() => {
    const packShotMedia = media?.nodes.find(
      (media) => (media as MediaImage)?.image?.url === selectVariantImageUrl,
    );
    const textureMedia = textureImgVariant?.reference!;
    const galleryVariantMedias = galleryMedias?.references?.nodes! ?? [];
    const othersMedias =
      media?.nodes.filter(
        (media) =>
          !variants?.nodes.some(
            (variant) =>
              variant.image?.url === (media as MediaImage)?.image?.url,
          ),
      ) ?? [];

    const sortedMedias = [
      packShotMedia,
      textureMedia,
      ...galleryVariantMedias,
      ...othersMedias,
    ];

    return sortedMedias?.filter((value) => value !== undefined) as Media[];
  }, [
    media?.nodes,
    selectVariantImageUrl,
    textureImgVariant,
    galleryMedias,
    variants?.nodes,
  ]);

  if (!medias?.length) {
    return <div className={cn(styles.root, styles.skeleton)} />;
  }

  return (
    <Drawer
      open={isProductZoomOpen}
      onOpenChange={(open: boolean) => setIsProductZoomOpen(open)}
    >
      <Carousel
        mousewheel={{forceToAxis: true}}
        className={styles.root}
        slidesPerView={1}
        pagination={{clickable: false}}
        breakpoints={{
          1024: {
            enabled: false,
            slidesPerView: 'auto',
          },
        }}
      >
        {medias?.map((media, index) => {
          const {image} = media as MediaImage;

          return (
            <DrawerTrigger
              key={`${media?.id}-${index + 1}`}
              className={styles.trigger}
              onClick={() => setIsIndexClicked(index)}
              aria-label={
                image?.altText! ?? media?.alt! ?? `media ${index + 1}`
              }
            >
              {(() => {
                switch (media?.mediaContentType) {
                  case 'VIDEO':
                    const video = media as VideoType;

                    return (
                      <Video
                        key={video.id}
                        source={video}
                        muted
                        autoPlay
                        loop
                      />
                    );
                  case 'IMAGE':
                  default:
                    return (
                      media && (
                        <Image
                          key={image?.id}
                          data={image!}
                          aspectRatio="1/1"
                          sizes={`(min-width: 120rem) ${
                            index === 0 ? '61.875rem' : '30.5rem'
                          }, (min-width: 64rem) ${
                            index === 0 ? '47vw' : '22.75vw'
                          }, 100vw`}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchPriority={index === 0 ? 'high' : undefined}
                        />
                      )
                    );
                }
              })()}
            </DrawerTrigger>
          );
        })}
      </Carousel>
      {isDesktop && (
        <ProductZoomDrawer
          medias={medias as Media[]}
          initialSlide={isIndexClicked}
        />
      )}
    </Drawer>
  );
}
