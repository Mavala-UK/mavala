import {VisuallyHidden} from '@radix-ui/react-visually-hidden';
import {Map} from 'mapbox-gl';
import {
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
} from '../ui/Drawer';
import {FormattedMessage} from 'react-intl';
import {useStoreLocator} from './StoreLocator';
import {Close} from '../icons/Close';
import styles from './MapDrawer.module.css';

export function MapDrawer() {
  const {mapOptions, initializeMap} = useStoreLocator();

  const ref: React.RefCallback<HTMLDivElement> = (node) => {
    if (!node) return;

    const map = new Map({
      ...mapOptions,
      container: node,
    });

    initializeMap(map);

    return () => {
      map.remove();
    };
  };

  return (
    <DrawerContent>
      <DrawerHeader className={styles.header}>
        <VisuallyHidden>
          <DrawerTitle>
            <FormattedMessage id="map" />
          </DrawerTitle>
        </VisuallyHidden>
        <DrawerClose>
          <Close />
        </DrawerClose>
      </DrawerHeader>
      <div className={styles.map} ref={ref} />
    </DrawerContent>
  );
}
