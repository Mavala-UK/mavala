import * as Tabs from '@radix-ui/react-tabs';
import {startTransition, useState} from 'react';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Heading} from '../ui/Heading';
import {Button} from '../ui/Button';
import {Carousel} from '../ui/Carousel';
import {ProductCard} from '../product/ProductCard';
import {useCollectionItem} from '~/hooks/useCollectionItem';
import styles from './HotPicks.module.css';

type HotPicksType = {
  _type: 'hotPicks';
  _key: string | null;
  title: string | null;
  collections: Array<{
    handle: string | null;
  }> | null;
} | null;

export function HotPicks({data}: {data: HotPicksType}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {title, collections} = data ?? {};
  const [tab, setTab] = useState<string>(collections?.[0].handle ?? '');
  const titleParts = title?.split(',');

  if (!data || !title || !collections) {
    return null;
  }

  const handleTabChange = (value: string) => {
    startTransition(() => {
      setTab(value);
    });
  };

  return (
    <section className={styles.root}>
      <Heading className={styles.title} size={isDesktop ? '2xl' : 'xl'}>
        {titleParts?.[0]}
        {titleParts?.length! > 1 && (
          <>
            {','}
            <br />
            {titleParts?.[1]}
          </>
        )}
      </Heading>
      {collections.length > 1 ? (
        <Tabs.Root value={tab} onValueChange={handleTabChange}>
          <Tabs.List className={styles['tab-list']}>
            {collections?.map(({handle}) => (
              <Tab key={handle} handle={handle!} />
            ))}
          </Tabs.List>
          {collections?.map(({handle}) => (
            <Tabs.Content value={handle!} key={handle}>
              <CollectionContent handle={handle!} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      ) : (
        collections?.map(({handle}) => (
          <CollectionContent handle={handle!} key={handle} />
        ))
      )}
    </section>
  );
}

/* Tab trigger */
function Tab({handle}: {handle: string}) {
  const {data: collection} = useCollectionItem(handle, {first: 3});
  const {title} = collection ?? {};

  return (
    <Tabs.Trigger
      key={handle}
      className={styles.trigger}
      value={handle!}
      asChild
    >
      <Button variant="unstyled" size="2xs">
        {title}
      </Button>
    </Tabs.Trigger>
  );
}

/* Tab content */
function CollectionContent({handle}: {handle: string}) {
  const {data} = useCollectionItem(handle, {first: 10});
  const {products} = data ?? {};

  return (
    <Carousel
      navigation
      mousewheel={{forceToAxis: true}}
      variant="product"
      slidesPerView={2}
      spaceBetween={8}
      breakpoints={{
        768: {
          slidesPerView: 3,
          spaceBetween: 8,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
      }}
    >
      {products?.nodes.map((product) => (
        <ProductCard
          handle={product.handle}
          initialData={product}
          key={product.id}
        />
      )) ??
        Array.from({length: 4}).map((_, index) => (
          <div className={styles.card} key={index} />
        ))}
    </Carousel>
  );
}
