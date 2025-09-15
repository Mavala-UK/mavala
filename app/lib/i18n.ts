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
  },
  mavalaCorporate: {
    default: {
      label: 'English',
      language: 'EN',
      country: 'GB',
      currency: 'GBP',
    },
  },
};

export function getLocalesByDomain(sites: Sites) {
  // Since both sites use the same English configuration
  return LOCALES.mavalaFrance; // or mavalaCorporate - they're identical now
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
