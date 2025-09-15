// Currency code (ISO 4217) to use when displaying prices in the studio

import {ComposeIcon, SearchIcon, DashboardIcon} from '@sanity/icons';
import {ShopifyIcon} from './components/Shopify';

export const SANITY = typeof window !== 'undefined' ? window.SANITY : null;
export const SITES = typeof window !== 'undefined' ? window.SITES : null;

// API version to use when using the Sanity client within the studio
// https://www.sanity.io/help/studio-client-specify-api-version
export const SANITY_API_VERSION = SANITY?.apiVersion ?? '';
export const ENVIRONMENT = Symbol('Sanity Environment');

// Your Shopify store ID.
// This is the ID in your Shopify admin URL (e.g. 'my-store-name' in https://admin.shopify.com/store/my-store-name).
// You only need to provide the ID, not the full URL.
// Set this to enable helper links in document status banners and shortcut links on products and collections.
export const SHOPIFY_STORE_ID = (() => {
  switch (true) {
    case SITES?.isMavalaFrance:
      return 'mavala-shop';
    case SITES?.isMavalaCorporate:
      return 'mavala-corporate';
  }
})();

// https://en.wikipedia.org/wiki/ISO_4217
export const DEFAULT_CURRENCY_CODE = 'GBP';

/* To put back when multiplus locales */
// LANGUAGES to use in the studio
// export const LANGUAGES = [
//   {id: 'fr', title: 'Français'},
//   {id: 'en', title: 'English'},
// ];

/* Single language configuration */
export const LANGUAGES = [{id: 'en', title: 'English'}];

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['home', 'blog', 'media.tag'];

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
// - are from the Sanity Connect Shopify app - and can be linked to on Shopify
export const SHOPIFY_DOCUMENT_TYPES = [
  'product',
  'productVariant',
  'collection',
];

// References to include in 'internal' links
export const PAGE_REFERENCES = [
  {type: 'article'},
  {type: 'articleCategory'},
  {type: 'collection'},
  {type: 'home'},
  {type: 'blog'},
  {type: 'page'},
  {type: 'product'},
];

// Field groups used through schema types
export const GROUPS = [
  {
    default: true,
    name: 'editorial',
    title: 'Editorial',
    icon: ComposeIcon,
  },
  {
    name: 'additional',
    title: 'Additional Content',
    icon: DashboardIcon,
  },
  {
    name: 'shopifySync',
    title: 'Shopify Sync',
    icon: ShopifyIcon,
  },
  {
    name: 'seo',
    title: 'SEO',
    icon: SearchIcon,
  },
];
