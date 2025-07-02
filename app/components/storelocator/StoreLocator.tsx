import {
  createContext,
  use,
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useLoaderData } from 'react-router';
import type {Feature, Point} from 'geojson';
import mapboxgl, {
  NavigationControl,
  GeolocateControl,
  type Map,
  type MapOptions,
} from 'mapbox-gl';
import type {loader} from '~/routes/_store.($locale).store-locator';
import {FormattedMessage, useIntl} from 'react-intl';
import {Drawer, DrawerTrigger} from '../ui/Drawer';
import {Button} from '../ui/Button';
import {startTransition} from 'react';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {MapDrawer} from './MapDrawer';
import {StoreLocatorList} from './StoreLocatorList';
import {Text} from '../ui/Text';
import {StoreDrawer} from './StoreDrawer';
import styles from './StoreLocator.module.css';

export function StoreLocator() {
  return (
    <StoreLocatorProvider>
      <StoreLocatorContent />
    </StoreLocatorProvider>
  );
}

export function useStoreLocator() {
  return use(StoreLocatorContext);
}

type StoreLocatorContextType = {
  stores: Feature[];
  selectedStore: Feature | null;
  changeStore: (store: Feature | null) => void;
  mapOptions: Partial<MapOptions>;
  initializeMap: (map: Map) => void;
};

const StoreLocatorContext = createContext<StoreLocatorContextType>({
  stores: [],
  selectedStore: null,
  changeStore: () => {},
  mapOptions: {},
  initializeMap: () => {},
});

function StoreLocatorProvider({children}: {children: React.ReactNode}) {
  const {formatMessage} = useIntl();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {stores, mapboxAccessToken} = useLoaderData<typeof loader>();
  const [selectedStore, setSelectedStore] = useState<Feature | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  const [filteredStores, setFilteredStores] = useState<Feature[]>(
    stores.features,
  );
  const deferredStores = useDeferredValue(filteredStores);

  const handleStoreModalOpenChange = (open: boolean) => {
    setIsStoreModalOpen(open);
  };

  const mapOptions = useMemo(
    () =>
      ({
        accessToken: mapboxAccessToken,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [2.331478030667968, 46.62779395314277],
        zoom: 4,
        attributionControl: false,
        projection: {name: 'mercator'},
      }) satisfies Omit<MapOptions, 'container'>,
    [mapboxAccessToken],
  );

  const initializeMap = useCallback(
    (map: Map) => {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxAccessToken as string,
        placeholder: formatMessage({
          id: 'enter_an_address',
        }),
        // @ts-expect-error: MapboxGeocoder typings are incorrect
        mapboxgl,
      });

      // @ts-expect-error: MapboxGeocoder typings are incorrect
      map.addControl(geocoder, 'top-left');
      map.addControl(new GeolocateControl(), 'top-left');

      map.addControl(
        new NavigationControl({showCompass: false}),
        'bottom-left',
      );

      map.on('load', () => {
        const addStoreLayer = (source: string) => {
          map.addLayer({
            id: source,
            type: 'circle',
            source,
            paint: {
              'circle-color': '#a22034',
              'circle-opacity': 0.2,
              'circle-stroke-color': '#a22034',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4,
                2,
                12,
                6,
                14,
                isDesktop ? 12 : 18,
              ],
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4,
                0.1,
                12,
                0.75,
                15,
                source === 'selected-store' ? 4 : 1,
              ],
            },
          });
        };

        map.addSource('stores', {
          type: 'geojson',
          data: stores,
        });

        addStoreLayer('stores');

        map.addSource('selected-store', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        addStoreLayer('selected-store');

        map.addLayer({
          id: 'selected-store',
          type: 'circle',
          source: 'selected-store',
          paint: {
            'circle-color': '#a22034',
            'circle-opacity': 0.2,
            'circle-stroke-color': '#a22034',
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4,
              2,
              12,
              6,
              14,
              isDesktop ? 12 : 18,
            ],
            'circle-stroke-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4,
              0.1,
              12,
              0.75,
              15,
              4,
            ],
          },
        });

        map.on('mouseenter', 'stores', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'stores', () => {
          map.getCanvas().style.cursor = '';
        });

        map.on('click', 'stores', (event) => {
          const feature = (event.features as Feature<Point>[])[0];

          startTransition(() => {
            const selected = stores.features.find(
              (store) => store.properties.id === feature?.properties?.id,
            )!;
            setSelectedStore(selected);
            setSelectedStoreOnMap(map, selected);

            if (!isDesktop) setIsStoreModalOpen(true);
          });

          map.flyTo({
            center: feature.geometry.coordinates as [number, number],
            zoom: 15,
          });
        });

        map.on('moveend', () => {
          const bounds = map.getBounds();

          startTransition(() => {
            setFilteredStores(
              stores.features.filter((store) => {
                const {coordinates} = store.geometry as Point;
                const longitude = coordinates[0];
                const latitude = coordinates[1];

                return (
                  Number(longitude) >= (bounds?.getWest() ?? 0) &&
                  Number(longitude) <= (bounds?.getEast() ?? 0) &&
                  Number(latitude) >= (bounds?.getSouth() ?? 0) &&
                  Number(latitude) <= (bounds?.getNorth() ?? 0)
                );
              }),
            );
          });
        });
      });
    },
    [isDesktop, mapboxAccessToken, stores],
  );

  const value: StoreLocatorContextType = {
    stores: deferredStores,
    selectedStore,
    changeStore: setSelectedStore,
    mapOptions,
    initializeMap,
  };

  return (
    <StoreLocatorContext value={value}>
      <Drawer open={isStoreModalOpen} onOpenChange={handleStoreModalOpenChange}>
        {children}
      </Drawer>
    </StoreLocatorContext>
  );
}

const setSelectedStoreOnMap = (map: Map | null, feature: Feature | null) => {
  if (!map || !feature) return;

  const selectedStoreSource = map.getSource('selected-store') as
    | mapboxgl.GeoJSONSource
    | undefined;
  if (selectedStoreSource) {
    selectedStoreSource.setData({
      type: 'FeatureCollection',
      features: [feature],
    });
  }
};

function StoreLocatorContent() {
  const {formatMessage} = useIntl();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const [map, setMap] = useState<Map | null>(null);
  const {stores, selectedStore, changeStore, mapOptions, initializeMap} =
    useStoreLocator();

  const ref: React.RefCallback<HTMLDivElement> = (node) => {
    if (!node) return;

    if (!mapboxgl.supported()) {
      console.error(formatMessage({id: 'webgl_is_not_supported'}));
      return;
    }

    const map = new mapboxgl.Map({
      ...mapOptions,
      container: node,
      zoom: isDesktop ? 5 : 4,
      interactive: isDesktop ? true : false,
    });

    setMap(map);

    if (isDesktop) {
      initializeMap(map);
    }

    return () => {
      map.remove();
    };
  };

  const handleClick = (store: Feature) => {
    changeStore(store);

    const {coordinates} = store.geometry as Point;

    map?.flyTo({
      center: coordinates as [number, number],
      zoom: 15,
    });

    setSelectedStoreOnMap(map, store);
  };

  return (
    <div className={styles.root}>
      <div className={styles['map-container']}>
        {!mapboxgl.supported() ? (
          <Text color="medium" className={styles.error} size="sm">
            <FormattedMessage id="webgl_is_not_supported" />
          </Text>
        ) : (
          <>
            <div className={styles.map} ref={ref} />
            <Drawer>
              <DrawerTrigger className={styles['map-button']} asChild>
                <Button>
                  <FormattedMessage id="open_map" />
                </Button>
              </DrawerTrigger>
              {!isDesktop && <MapDrawer />}
            </Drawer>
          </>
        )}
      </div>
      <StoreLocatorList
        stores={stores}
        selectedStore={selectedStore!}
        onClick={handleClick}
      />
      <StoreDrawer />
    </div>
  );
}
