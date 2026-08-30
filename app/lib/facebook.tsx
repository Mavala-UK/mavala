import {useAnalytics, type CartLineUpdatePayload, type ProductViewPayload} from '@shopify/hydrogen';
import {useEffect} from 'react';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export const FB_PIXEL_ID = '2246267329245921';

export function FacebookPixel() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('FacebookPixel');

  useEffect(() => {
    // 1. Initialize Meta Pixel snippet on client
    if (typeof window !== 'undefined' && !window.fbq) {
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js',
      );

      if (window.fbq) {
        window.fbq('init', FB_PIXEL_ID);
      }
    }

    // 2. Track standard storefront events
    subscribe('page_viewed', () => {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
      }
    });

    subscribe('product_viewed', (data: ProductViewPayload) => {
      const product = data.products?.[0];
      if (product && typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
          content_name: product.title,
          content_ids: [product.id?.split('/').pop() || ''],
          content_type: 'product',
          value: product.price,
          currency: product.currency || 'GBP',
        });
      }
    });

    subscribe('product_added_to_cart', (data: CartLineUpdatePayload) => {
      const line = data.currentLine?.merchandise;
      if (line && typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_name: line.product?.title,
          content_ids: [line.id?.split('/').pop() || ''],
          content_type: 'product',
          value: line.price?.amount,
          currency: line.price?.currencyCode || 'GBP',
        });
      }
    });

    ready();
  }, [ready, subscribe]);

  return null;
}
