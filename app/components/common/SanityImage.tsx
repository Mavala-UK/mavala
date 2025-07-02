import { useRouteLoaderData } from 'react-router';
import type {SanityImageSource} from '@sanity/asset-utils';
import {getImageAsset} from '@sanity/asset-utils';
import imageUrlBuilder from '@sanity/image-url';
import {Image} from '@shopify/hydrogen';
import {forwardRef} from 'react';
import type {SanityImageCrop, SanityImageHotspot} from 'sanity.generated';
import type {RootLoader} from '~/root';

export type ImageType =
  | {
      asset: {
        _id: string;
        altText: string | null;
      } | null;
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: 'image';
      _key?: string;
    }
  | null
  | undefined;

export const SanityImage = forwardRef<
  React.ComponentRef<typeof Image>,
  Omit<React.ComponentPropsWithoutRef<typeof Image>, 'data'> & {
    data?: ImageType;
  }
>(function SanityImage({data, ...props}, ref) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {sanity} = rootData ?? {};

  if (!data || !sanity) {
    return null;
  }

  const builder = imageUrlBuilder(sanity).image(data).auto('format');
  const url = builder.url();
  const {metadata} = getImageAsset(data as SanityImageSource, sanity);
  const altText = data.asset?.altText ?? '';
  const {width, height} = metadata.dimensions;

  const hydrogenData: React.ComponentPropsWithoutRef<typeof Image>['data'] = {
    url,
    altText,
    width,
    height,
  };

  const loader: React.ComponentPropsWithoutRef<typeof Image>['loader'] = ({
    width = 0,
    height = 0,
    crop = 'center',
  }) =>
    builder
      .width(Math.floor(width))
      .height(Math.floor(height))
      .fit('crop')
      .crop(crop)
      .url();

  return <Image data={hydrogenData} loader={loader} ref={ref} {...props} />;
});
