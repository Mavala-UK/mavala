import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function AxeptioConsent() {
  const {register, customerPrivacy} = useAnalytics();
  const {ready} = register('Axeptio');

  useEffect(() => {
    (window._axcb = window._axcb || []).push((sdk) => {
      sdk.on('ready', () => {
        sdk.on('cookies:complete', (choices: any) => {
          // Mavala's Axeptio dashboard is configured in Google Consent Mode v2
          // mode (no per-vendor list), so the only useful field in choices is
          // the $$googleConsentMode block. We map its four signals to Shopify's
          // four Customer Privacy fields. The mapping is a judgment call; see
          // memory/axeptio-customer-privacy-bridge.md for the rationale.
          //
          //   analytics_storage   -> analytics    (direct semantic match)
          //   ad_storage          -> marketing    (advertising data = marketing consent)
          //   ad_user_data        -> sale_of_data (sharing user data with third parties)
          //   ad_personalization  -> preferences  (personalisation / profiling)
          //
          // If $$googleConsentMode is missing entirely, all four resolve to
          // false, which defaults consent to denied. Safe.
          const cm = choices?.$$googleConsentMode;
          const isGranted = (key: string): boolean =>
            cm?.[key] === 'granted';

          customerPrivacy?.setTrackingConsent(
            {
              analytics: isGranted('analytics_storage'),
              marketing: isGranted('ad_storage'),
              preferences: isGranted('ad_personalization'),
              sale_of_data: isGranted('ad_user_data'),
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
