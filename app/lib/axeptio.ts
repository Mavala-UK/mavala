import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function AxeptioConsent() {
  const {register, customerPrivacy} = useAnalytics();
  const {ready} = register('Axeptio');

  useEffect(() => {
    (window._axcb = window._axcb || []).push((sdk) => {
      sdk.on('ready', () => {
        sdk.on('cookies:complete', (choices) => {
          const canTrack = choices['shopify.com'];

          customerPrivacy?.setTrackingConsent(
            {
              marketing: canTrack,
              analytics: canTrack,
              preferences: canTrack,
              sale_of_data: canTrack,
            },
            (result: {error: string} | undefined) => {
              if (result?.error) {
                console.error(
                  'Error syncing Axeptio with Shopify customer privacy',
                  result,
                );
                return;
              }

              ready();
            },
          );
        });
      });
    });
  }, [customerPrivacy, ready]);

  return null;
}
