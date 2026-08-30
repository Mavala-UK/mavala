// Custom Pixel for Shopify Checkout
// Add this in Shopify Admin -> Settings -> Customer Events -> Add custom pixel
// Name: Meta / Facebook Pixel Tracking
// Permissions: Marketing & Analytics

const FB_PIXEL_ID = '2246267329245921';

// Initialize Meta Pixel Base Code
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', FB_PIXEL_ID);

// Subscribe to standard Shopify Checkout & Customer events
analytics.subscribe('page_viewed', (event) => {
  fbq('track', 'PageView');
});

analytics.subscribe('product_viewed', (event) => {
  const line = event.data?.productVariant;
  fbq('track', 'ViewContent', {
    content_name: line?.product?.title,
    content_ids: [line?.id?.split('/').pop() || ''],
    content_type: 'product',
    value: line?.price?.amount,
    currency: line?.price?.currencyCode || 'GBP',
  });
});

analytics.subscribe('product_added_to_cart', (event) => {
  const line = event.data?.cartLine?.merchandise;
  fbq('track', 'AddToCart', {
    content_name: line?.product?.title,
    content_ids: [line?.id?.split('/').pop() || ''],
    content_type: 'product',
    value: line?.price?.amount,
    currency: line?.price?.currencyCode || 'GBP',
  });
});

analytics.subscribe('checkout_started', (event) => {
  const checkout = event.data?.checkout;
  fbq('track', 'InitiateCheckout', {
    value: checkout?.totalPrice?.amount,
    currency: checkout?.totalPrice?.currencyCode || 'GBP',
    num_items: checkout?.lineItems?.length || 0,
    content_ids: checkout?.lineItems?.map((l) => l.variant?.id?.split('/').pop() || '') || [],
  });
});

analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data?.checkout;
  fbq('track', 'Purchase', {
    value: checkout?.totalPrice?.amount,
    currency: checkout?.totalPrice?.currencyCode || 'GBP',
    num_items: checkout?.lineItems?.length || 0,
    content_ids: checkout?.lineItems?.map((l) => l.variant?.id?.split('/').pop() || '') || [],
    order_id: checkout?.order?.id?.split('/').pop() || '',
  });
});
