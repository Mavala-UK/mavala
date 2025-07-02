import {useSyncExternalStore} from 'react';

export function useMediaQuery(query: string) {
  const getSnapshot = () => window.matchMedia(query).matches;

  const subscribe = (callback: () => void) => {
    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener('change', callback);

    return () => {
      mediaQueryList.removeEventListener('change', callback);
    };
  };

  const matches = useSyncExternalStore(subscribe, getSnapshot, () => false);

  return matches;
}
