import type {
  PortableTextProps,
  PortableTextReactComponents,
} from '@portabletext/react';
import {PortableText as PortableTextComponent} from '@portabletext/react';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {TextContainer} from '../ui/TextContainer';
import type {ImageType} from './SanityImage';
import {SanityImage} from './SanityImage';
import {SanityVideo, type VideoType} from './SanityVideo';
import {
  ArgumentsCarousel,
  type ArgumentsCarouselType,
} from '../page/blocks/ArgumentsCarousel';
import {DuoMedias, type DuoMediasType} from '../page/blocks/DuoMedias';
import {ProductList, type ProductListType} from '../page/blocks/ProductList';
import {
  ImageWithTextCarousel,
  type ImageWithTextCarouselType,
} from '../page/blocks/ImageWithTextCarousel';
import {
  GalleryCarousel,
  type GalleryCarouselType,
} from '../page/blocks/GalleryCarousel';
import {
  ChronologicalCarousel,
  type ChronologicalCarouselType,
} from '../page/blocks/ChronologicalCarousel';
import {TinyImage, type TinyImageType} from '../blog/blocks/TinyImage';
import {Steps, type StepsType} from '../blog/blocks/Steps';
import {Link} from '../ui/Link';
import {Heading} from '../ui/Heading';
import {BunnyVideo, BunnyVideoType} from '../page/blocks/BunnyVideo';
import {Text} from '../ui/Text';

export function PortableText({
  value,
  className,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<typeof TextContainer> &
  Pick<PortableTextProps, 'value'>) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  const components = {
    listItem: {
      bullet: ({children}) =>
        variant === 'block' ? (
          <Text asChild weight="light">
            <li>{children}</li>
          </Text>
        ) : (
          <Text size={isDesktop ? 'lg' : 'md'} weight="light" asChild>
            <li>{children}</li>
          </Text>
        ),
      number: ({children}) =>
        variant === 'block' ? (
          <Text asChild>
            <li>{children}</li>
          </Text>
        ) : (
          <Text size={isDesktop ? 'lg' : 'md'} weight="light" asChild>
            <li>{children}</li>
          </Text>
        ),
    },
    marks: {
      link: ({children, value}) => (
        <Link to={value.href} variant="underline" size="sm" color="grayed">
          {children}
        </Link>
      ),
    },
    block: {
      normal: ({children}) =>
        variant === 'block' ? (
          <Text weight="light">{children}</Text>
        ) : (
          <Text size={isDesktop ? 'lg' : 'md'} weight="light">
            {children}
          </Text>
        ),
      h1: ({children}) => (
        <Heading size={isDesktop ? '3xl' : 'xl'} asChild>
          <h1>{children}</h1>
        </Heading>
      ),
      h2: ({children}) => (
        <Heading size={isDesktop ? '2xl' : 'xl'}>{children}</Heading>
      ),
      h3: ({children}) => (
        <Text size={isDesktop ? 'xl' : 'md'} weight="medium" asChild>
          <h3>{children}</h3>
        </Text>
      ),
      h4: ({children}) => (
        <Text size={isDesktop ? 'lg' : 'sm'} weight="medium" asChild>
          <h4>{children}</h4>
        </Text>
      ),
      h5: ({children}) => (
        <Text size={isDesktop ? 'md' : 'xs'} weight="medium" asChild>
          <h5>{children}</h5>
        </Text>
      ),
      h6: ({children}) => (
        <Text size={isDesktop ? 'sm' : '2xs'} weight="medium" asChild>
          <h6>{children}</h6>
        </Text>
      ),
    },
    types: {
      image: ({value}: {value: ImageType}) => (
        <SanityImage
          data={value}
          sizes="(min-width: 120rem) 55.5rem, (min-width: 64rem) 59.5vw, 90vw"
        />
      ),
      video: ({value}: {value: VideoType}) => (
        <SanityVideo data={value} controls />
      ),
      bunnyVideo: ({value}: {value: BunnyVideoType}) => (
        <BunnyVideo value={value} />
      ),
      tinyImage: ({value}: {value: TinyImageType}) => (
        <TinyImage data={value} />
      ),
      argumentsCarousel: ({value}: {value: ArgumentsCarouselType}) => (
        <ArgumentsCarousel data={value} />
      ),
      duoMedias: ({value}: {value: DuoMediasType}) => (
        <DuoMedias data={value} />
      ),
      productList: ({value}: {value: ProductListType}) => (
        <ProductList data={value} />
      ),
      galleryCarousel: ({value}: {value: GalleryCarouselType}) => (
        <GalleryCarousel data={value} />
      ),
      imageWithTextCarousel: ({value}: {value: ImageWithTextCarouselType}) => (
        <ImageWithTextCarousel data={value} />
      ),
      chronologicalCarousel: ({value}: {value: ChronologicalCarouselType}) => (
        <ChronologicalCarousel data={value} />
      ),
      steps: ({value}: {value: StepsType}) => <Steps data={value} />,
    },
  } satisfies Partial<PortableTextReactComponents>;

  return (
    <TextContainer
      {...props}
      className={className}
      {...(variant && {
        'data-variant': variant,
      })}
    >
      <PortableTextComponent value={value} components={components} />
    </TextContainer>
  );
}
