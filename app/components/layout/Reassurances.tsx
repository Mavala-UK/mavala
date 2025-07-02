import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import {RichText} from '../common/RichText';
import {Carousel} from '../ui/Carousel';
import {Text} from '../ui/Text';
import styles from './Reassurances.module.css';

export function Reassurances() {
  const data = useRouteLoaderData<RootLoader>('root');
  const reassurances = data?.global?.reassurances?.references?.nodes;

  if (!reassurances) {
    return null;
  }

  return (
    <aside className={styles.root}>
      <Carousel
        mousewheel={{forceToAxis: true}}
        slidesPerView="auto"
        className={styles.carousel}
        pagination={{clickable: true}}
      >
        {reassurances?.map((reassurance) => (
          <div className={styles.item} key={reassurance.id}>
            <Text className={styles['item-title']} size="sm" weight="medium">
              {reassurance.title?.value}
            </Text>
            <Text
              size="sm"
              color="medium"
              weight="light"
              asChild
              className={styles['item-description']}
            >
              <RichText data={reassurance.text?.value} />
            </Text>
          </div>
        ))}
      </Carousel>
    </aside>
  );
}
