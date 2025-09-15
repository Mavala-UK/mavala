import type {Localizations, I18nLocale, Sites} from './types';

export const LOCALES: Record<
  'mavalaFrance' | 'mavalaCorporate',
  Localizations
> = {
  mavalaFrance: {
    default: {
      label: 'English',
      language: 'EN',
      country: 'GB',
      currency: 'GBP',
    },
    // '/fr': {
    //   label: 'Français',
    //   language: 'FR',
    //   country: 'GB',
    //   currency: 'GBP',
    // },
  },
  mavalaCorporate: {
    default: {
      label: 'English',
      language: 'EN',
      country: 'CH',
      currency: 'CHF',
    },
    // '/fr': {
    //   label: 'Français',
    //   language: 'FR',
    //   country: 'FR',
    //   currency: 'CHF',
    // },
  },
};

export function getLocalesByDomain(sites: Sites) {
  switch (true) {
    case sites?.isMavalaCorporate:
      return LOCALES.mavalaCorporate;
    case sites?.isMavalaFrance:
    default:
      return LOCALES.mavalaFrance;
  }
}

export function getLocaleFromRequest(
  request: Request,
  locales: Localizations,
): I18nLocale {
  const url = new URL(request.url);

  const localePathname = Object.keys(locales).filter(
    (locale) => locale !== 'default',
  )[0];

  return url.pathname.startsWith(localePathname)
    ? {...locales[localePathname], pathPrefix: localePathname}
    : {...locales['default'], pathPrefix: ''};
}
