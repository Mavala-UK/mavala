import {useEffect} from 'react';
import {useAnalytics} from '@shopify/hydrogen';
import {useLocation} from 'react-router';
import {
  ProductItemFragment,
  ProductVariantItemFragment,
} from 'storefrontapi.generated';
import {
  type CartViewPayload,
  type CartUpdatePayload,
  type CartLineUpdatePayload,
  type ProductViewPayload,
  type CollectionViewPayload,
  type SearchViewPayload,
} from '@shopify/hydrogen';

declare global {
  interface Window {
    omnisend?: any[];
    ENV?: {
      OMNISEND_BRAND_ID?: string;
    };
  }
}

export function OmnisendAnalytics() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Omnisend');
  const routerLocation = useLocation();

  useEffect(() => {
    // Initialize Omnisend
    const initializeOmnisend = () => {
      if (!window.omnisend) {
        window.omnisend = [];
      }

      const brandId = window.ENV?.OMNISEND_BRAND_ID;
      if (brandId) {
        window.omnisend.push(['brandID', brandId]);
        window.omnisend.push(['track', '$pageViewed']);
      }

      setupEventListeners();
      ready();
    };

    const setupEventListeners = () => {
      /* product view */
      subscribe('product_viewed', (data) => trackProductView(data));

      /* collection viewed */
      subscribe('collection_viewed', (data) => trackCollectionView(data));

      /* search viewed */
      subscribe('search_viewed', (data) => trackSearchView(data));

      /* cart viewed */
      subscribe('cart_viewed', (data) => trackCartView(data));

      /* product added to cart */
      subscribe('product_added_to_cart', (data) =>
        trackAddToCart(data, routerLocation),
      );

      /* product removed from cart */
      subscribe('product_removed_from_cart', (data) =>
        trackRemoveFromCart(data),
      );

      /* cart updated */
      subscribe('cart_updated', (data) => trackCartUpdate(data));
    };

    initializeOmnisend();
  }, []);

  return null;
}

/* Helper function to format product data for Omnisend */
function formatProductForOmnisend(
  product: ProductItemFragment,
  variant?: ProductVariantItemFragment,
) {
  const selectedVariant = variant || product.variants?.nodes?.[0];

  return {
    productID: product.id.split('/').pop(),
    productTitle: product.title,
    productPrice: selectedVariant?.price?.amount
      ? parseFloat(selectedVariant.price.amount)
      : 0,
    currency: selectedVariant?.price?.currencyCode || 'USD',
    productURL: `/products/${product.handle}`,
    productImageURL: product.featuredImage?.url || '',
    productVariantID: selectedVariant?.id?.split('/').pop(),
    productCategories: [
      {
        id: product.productType || 'general',
        title: product.productType || 'General',
      },
    ],
  };
}

/* Helper function to format cart line for Omnisend */
function formatCartLineForOmnisend(line: any) {
  const {quantity, merchandise} = line || {};
  const {product} = merchandise || {};

  return {
    productID: product?.id?.split('/').pop(),
    productVariantID: merchandise?.id?.split('/').pop(),
    productTitle: product?.title,
    productPrice: parseFloat(merchandise?.price?.amount || '0'),
    productQuantity: quantity,
    productURL: `/products/${product?.handle}`,
    productImageURL: product?.featuredImage?.url || '',
    productCategories: [
      {
        id: product?.productType || 'general',
        title: product?.productType || 'General',
      },
    ],
  };
}

/* Track product view */
function trackProductView(data: ProductViewPayload) {
  if (!window.omnisend) return;

  const {products} = data || {};
  const product = products?.[0];

  if (product) {
    window.omnisend.push([
      'track',
      'viewed product',
      {
        eventVersion: 'v4',
        origin: 'api',
        properties: {
          product: {
            id: product.id?.split('/').pop() || '',
            title: product.title || '',
            price: parseFloat(product.price || '0'),
            currency: product.currency || 'USD',
            url: product.url || '',
            imageUrl: product.imageUrl || '',
            description: product.title || '',
            status: 'inStock',
          },
        },
      },
    ]);
  }
}

/* Track collection view */
function trackCollectionView(data: CollectionViewPayload) {
  if (!window.omnisend) return;

  const {collection, customData} = data || {};
  const products = customData?.products as ProductItemFragment[];

  if (products?.length > 0) {
    // Omnisend doesn't have a specific collection viewed event
    // We'll track it as a custom event or page view
    window.omnisend.push(['track', '$pageViewed']);
  }
}

/* Track search view */
function trackSearchView(data: SearchViewPayload) {
  if (!window.omnisend) return;

  const {searchTerm} = data || {};

  if (searchTerm) {
    // Track as page view since Omnisend doesn't have specific search event
    window.omnisend.push(['track', '$pageViewed']);
  }
}

/* Track cart view */
function trackCartView(data: CartViewPayload) {
  if (!window.omnisend) return;

  // Omnisend tracks cart abandonment automatically when products are added
  // No specific cart view event needed
}

/* Track add to cart */
function trackAddToCart(
  data: CartLineUpdatePayload,
  routerLocation?: ReturnType<typeof useLocation>,
) {
  if (!window.omnisend) return;

  const {currentLine, cart} = data || {};

  if (currentLine && cart) {
    const addedItem = formatCartLineForOmnisend(currentLine);
    const allItems = cart.lines?.nodes?.map(formatCartLineForOmnisend) || [];

    // Build the abandoned checkout URL using React Router location or fallback to window.location
    const origin = window.location.origin;
    const pathname = routerLocation
      ? routerLocation.pathname
      : window.location.pathname;
    const search = routerLocation
      ? routerLocation.search
      : window.location.search;

    window.omnisend.push([
      'track',
      'added product to cart',
      {
        origin: 'api',
        eventVersion: '',
        properties: {
          abandonedCheckoutURL: `${origin}${pathname}${search}`,
          cartID: cart.id?.split('/').pop(),
          currency: cart.cost?.totalAmount?.currencyCode || 'USD',
          value: parseFloat(cart.cost?.totalAmount?.amount || '0'),
          lineItems: allItems,
          addedItem: addedItem,
        },
      },
    ]);
  }
}

/* Track remove from cart */
function trackRemoveFromCart(data: CartLineUpdatePayload) {
  if (!window.omnisend) return;

  // Omnisend doesn't have a specific "removed from cart" event
  // Cart abandonment will be tracked automatically based on cart state
}

/* Track cart update */
function trackCartUpdate(data: CartUpdatePayload) {
  if (!window.omnisend) return;

  // Cart updates are handled through add to cart events
  // Omnisend tracks cart state automatically
}

/* Track purchase/order completion */
export function trackPurchase(orderData: {
  orderId: string;
  total: number;
  currency: string;
  products: any[];
  customerEmail?: string;
}) {
  if (!window.omnisend) return;

  window.omnisend.push([
    'track',
    'placed order',
    {
      origin: 'api',
      eventVersion: '',
      properties: {
        orderID: orderData.orderId,
        orderSum: orderData.total,
        currency: orderData.currency,
        orderProducts: orderData.products,
      },
    },
  ]);
}

/* Track email signup - identify contact */
export function trackEmailSignup(
  email: string,
  phone?: string,
  additionalData?: any,
) {
  if (!window.omnisend) return;

  const identifyData: any = {};

  if (email) identifyData.email = email;
  if (phone) identifyData.phone = phone;

  if (Object.keys(identifyData).length > 0) {
    // Use the identify contact function from the global omnisend object
    if ((window as any).omnisend?.identifyContact) {
      (window as any).omnisend.identifyContact({
        ...identifyData,
        ...additionalData,
      });
    }
  }
}

/* Show Omnisend popup/forms */
export function showOmnisendPopup(popupId?: string) {
  if (!window.omnisend) return;

  // Omnisend forms are triggered automatically based on settings
  // Manual triggering would need custom implementation
}

/* Hide Omnisend popups */
export function hideOmnisendPopups() {
  if (!window.omnisend) return;

  // Omnisend forms are controlled by their own logic
  // Manual hiding would need custom implementation
}

/* Initialize Omnisend manually with configuration */
export function initializeOmnisendManual(config: {
  brandID: string;
  enableTracking?: boolean;
}) {
  if (!window.omnisend) {
    window.omnisend = [];
  }

  // Initialize with brand ID
  window.omnisend.push(['brandID', config.brandID]);

  // Configure tracking
  if (config.enableTracking !== false) {
    window.omnisend.push(['track', '$pageViewed']);
  }
}
