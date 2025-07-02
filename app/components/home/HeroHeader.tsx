import {useState} from 'react';
import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import type {HeroQueryResult} from 'sanity.generated';
import {SanityImage} from '../common/SanityImage';
import type {ImageType} from '../common/SanityImage';
import {LinkType} from '~/sanity/types';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Carousel} from '../ui/Carousel';
import {ProductCard} from '../product/ProductCard';
import {BunnyVideo} from '../ui/BunnyVideo';
import {Heading} from '../ui/Heading';
import {Button, ButtonEffect} from '../ui/Button';
import {Link} from '../common/Link';
import styles from './HeroHeader.module.css';

const DELAY = 8000;

export function HeroHeader({
  hero: heroData,
  variant,
}: {
  hero: HeroQueryResult;
  variant?: 'full';
}) {
  const data = useRouteLoaderData<RootLoader>('root');
  const {selectedLocale} = data ?? {};
  const {pathPrefix} = selectedLocale ?? {};
  const [isPaused, setIsPaused] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {slides} = heroData?.hero ?? {};
  const sections = isDesktop
    ? slides
    : variant === 'full'
      ? slides
      : slides?.slice(0, 1);

  const handleAutoplayPause = () => {
    setIsPaused(true);
  };

  const handleAutoplayResume = () => {
    setIsPaused(false);
  };

  return (
    <section className={styles.root} data-variant={variant}>
      <Carousel
        mousewheel={{forceToAxis: true}}
        className={styles.carousel}
        slidesPerView="auto"
        autoplay={{
          delay: DELAY,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        pagination={{clickable: true}}
        loop={sections?.length! > 1}
        style={{['--progress-duration' as string]: `${DELAY / 1000}s`}}
        onAutoplayPause={handleAutoplayPause}
        onAutoplayResume={handleAutoplayResume}
        data-paused={isPaused}
      >
        {sections?.map((section, index) => {
          const {title, image, medias, mediasMobile, link, linkReferences} =
            section ?? {};

          const deviceMedias = isDesktop ? medias?.[0] : mediasMobile?.[0];

          const mediaImage =
            image ?? (deviceMedias?._type === 'image' && deviceMedias.asset);

          const bunnyVideoId =
            (deviceMedias?._type === 'bunnyVideoMedias' ||
              deviceMedias?._type === 'bunnyVideoMediasMobile') &&
            deviceMedias?.id;

          const linkSlide = (link ||
            (linkReferences?._type === 'link' && linkReferences)) as LinkType;

          return (
            <section key={section._key} className={styles.section}>
              <div className={styles['media-wrapper']}>
                {mediaImage && (
                  <SanityImage
                    data={mediaImage as ImageType}
                    sizes={`(min-width: 64rem) 86.6vh, 100vw`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : undefined}
                    style={{
                      width: undefined,
                      height: undefined,
                      aspectRatio: undefined,
                    }}
                  />
                )}
                {bunnyVideoId && <BunnyVideo id={bunnyVideoId} />}
              </div>
              <div
                className={styles.content}
                data-multiple={sections?.length! > 1}
              >
                <Heading
                  size={isDesktop ? '2xl' : 'xl'}
                  className={styles.title}
                >
                  {title}
                </Heading>
                {linkReferences?._type === 'reference' &&
                  variant !== 'full' && (
                    <ProductCard
                      handle={linkReferences?.product!}
                      variant="row"
                      priority
                    />
                  )}
                {linkSlide?.text && (
                  <Button theme="light" asChild>
                    <Link
                      to={`${pathPrefix}${linkSlide?.url}`}
                      className={styles.link}
                    >
                      <ButtonEffect>{linkSlide?.text}</ButtonEffect>
                    </Link>
                  </Button>
                )}
              </div>
            </section>
          );
        })}
      </Carousel>
    </section>
  );
}
