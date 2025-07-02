import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Heading} from '../ui/Heading';
import {Carousel} from '../ui/Carousel';
import {CollectionCard} from './CollectionCard';
import styles from './FeaturedCollections.module.css';

type FeaturedCollectionsType = {
  _type: 'featuredCollections';
  _key: string | null;
  title?: string | null;
  collections: Array<{
    handle: string | null;
  }> | null;
} | null;

export function FeaturedCollections({
  data,
  noTitle,
}: {
  data: FeaturedCollectionsType;
  noTitle?: boolean;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {title, collections} = data ?? {};

  if (!data || !collections) {
    return null;
  }

  return (
    <section className={styles.root} data-title={!noTitle}>
      {!noTitle && (
        <Heading className={styles.title} size={isDesktop ? '2xl' : 'xl'}>
          {title}
        </Heading>
      )}
      <Carousel
        navigation
        variant="collection"
        className={styles.carousel}
        mousewheel={{forceToAxis: true}}
        slidesPerView={1.35}
        spaceBetween={8}
        breakpoints={{
          480: {
            slidesPerView: 2.35,
            spaceBetween: 8,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        }}
      >
        {collections?.map(({handle}) => (
          <CollectionCard handle={handle ?? ''} key={handle} />
        ))}
      </Carousel>
    </section>
  );
}
