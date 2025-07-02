import {cn} from '~/lib/utils';
import type {ImageType} from '~/components/common/SanityImage';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Carousel} from '~/components/ui/Carousel';
import {Text} from '~/components/ui/Text';
import {Heading} from '~/components/ui/Heading';
import {SanityImage} from '~/components/common/SanityImage';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/Accordion';
import styles from './ChronologicalCarousel.module.css';

export type ChronologicalCarouselType = {
  _type: 'chronologicalCarousel';
  slides?: Array<{
    image?: ImageType;
    year?: number;
    title?: string | null;
    text?: string | null;
    _key: string;
  }>;
};

export function ChronologicalCarousel({
  data,
}: {
  data: ChronologicalCarouselType;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {slides} = data ?? {};

  return (
    <section className={cn('editorial-block', styles.root)}>
      {isDesktop ? (
        <Carousel
          spaceBetween={12}
          slidesPerView={'auto'}
          navigation
          mousewheel={{forceToAxis: true}}
          lazyPreloadPrevNext={1}
        >
          {slides?.map((slide) => {
            const {image, year, title, text} = slide ?? {};

            return (
              <div className={styles.slide} key={slide._key}>
                {image && (
                  <div className={styles['image-wrapper']}>
                    <SanityImage
                      data={image}
                      aspectRatio="3/4"
                      sizes="18.25rem"
                    />
                  </div>
                )}
                <div className={styles.content}>
                  {year && (
                    <Heading size="3xl" className={styles.year} asChild>
                      <span>{year}</span>
                    </Heading>
                  )}
                  <Text weight="medium">{title}</Text>
                  <Text className={styles.text} weight="light">
                    {text}
                  </Text>
                </div>
              </div>
            );
          })}
        </Carousel>
      ) : (
        <Accordion type="single" collapsible>
          {slides?.map((slide) => {
            const {image, year, title, text} = slide ?? {};

            return (
              <AccordionItem
                value={slide._key}
                key={slide._key}
                className={styles['accordion-item']}
              >
                <AccordionHeader asChild>
                  <AccordionTrigger className={styles['accordion-trigger']}>
                    <div className={styles['accordion-trigger-content']}>
                      {year && (
                        <Heading size="lg" asChild>
                          <span>{year}</span>
                        </Heading>
                      )}
                      <Text weight="medium" className={styles.title}>
                        {title}
                      </Text>
                    </div>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <Text weight="light">{text}</Text>
                  {image && (
                    <div className={styles['image-wrapper']}>
                      <SanityImage
                        data={image}
                        aspectRatio="1/1"
                        sizes="90vw"
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </section>
  );
}
