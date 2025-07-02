import {useEffect} from 'react';
import {useAnalytics} from '@shopify/hydrogen';
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
import {ShopQuery} from 'storefrontapi.generated';

export function GoogleTagManager() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    /* page viewed */
    subscribe('page_viewed', () =>
      window.dataLayer.push({
        event: 'view_page',
      }),
    );

    /* collection viewed */
    subscribe('collection_viewed', (data) =>
      GtmProductsData('view_collection', data),
    );

    /* search viewed */
    subscribe('search_viewed', (data) => GtmProductsData('view_search', data));

    /* product view */
    subscribe('product_viewed', (data) => GtmProductData('view_product', data));

    /* cart viewed */
    subscribe('cart_viewed', (data) => GtmCartData('view_cart', data));

    /* cart updated */
    subscribe('cart_updated', (data) => GtmCartData('updated_cart', data));

    /* product added to cart */
    subscribe('product_added_to_cart', (data) =>
      GtmCartData('add_to_cart', data),
    );

    /* product removed from cart */
    subscribe('product_removed_from_cart', (data) =>
      GtmCartData('remove_from_cart', data),
    );

    ready();
  }, []);

  return null;
}

/*  */
/*  */
/* common data */
const commonData = ({
  id,
  variantId,
  title,
  price,
  brand,
  category,
  index,
  quantity = 1,
}: {
  id: string;
  variantId: string;
  title: string;
  price: string;
  brand: string;
  category: string;
  index: number;
  quantity?: number;
}) => {
  return {
    item_id: `shopify_ZZ_${id.split('/').pop()}_${variantId.split('/').pop()}`,
    item_name: title,
    item_price: Number(price),
    item_brand: brand,
    item_category: category,
    index,
    quantity,
  };
};

/*  */
/*  */
/*  */
/* Products list datas */
function GtmProductsData(
  event: 'view_collection' | 'view_search',
  data: CollectionViewPayload | SearchViewPayload,
) {
  const collectionView = (data as CollectionViewPayload) ?? {};
  const searchView = (data as SearchViewPayload) ?? {};

  let products = [];
  switch (event) {
    case 'view_collection':
      products = collectionView?.customData?.products as ProductItemFragment[];
      break;
    case 'view_search':
      products = searchView?.searchResults?.items?.products?.nodes;
      break;
    default:
      return null;
  }

  const datas = {
    event,
    ecommerce: {
      items: products?.map((product: ProductItemFragment, index: number) => {
        const {id, title, productType: category, vendor: brand} = product ?? {};
        const variants = product.variants?.nodes;
        const selectedVariant =
          variants?.find(
            (variant) => variant.id === product?.defaultVariant?.reference?.id,
          ) ?? variants[0];

        return commonData({
          id,
          variantId: selectedVariant?.id,
          title,
          price: selectedVariant.price?.amount,
          brand,
          category,
          index,
        });
      }),
    },
  };

  window.dataLayer.push(datas);
}

/*  */
/*  */
/*  */
/*  */
/* Product datas */
type ProductClickData = {
  products: ProductItemFragment[];
  shop: ShopQuery['shop'];
};

export function GtmProductData(
  event: 'view_product' | 'click_product',
  data: ProductViewPayload | ProductClickData,
) {
  const {products: productsView, shop: shopView} =
    (data as ProductViewPayload) ?? {};
  const {products: productsClick, shop: shopClick} =
    (data as ProductClickData) ?? {};

  let currency = null;
  let products = [];

  switch (event) {
    case 'view_product':
      currency = shopView?.currency;
      products = productsView;
      break;
    case 'click_product':
      currency = shopClick?.paymentSettings?.currencyCode;
      products = productsClick;
      break;
    default:
      return null;
  }

  const datas = {
    event,
    ecommerce: {
      currency,
      items: products?.map((product: any, index) => {
        const {id, title, vendor: brand} = product ?? {};
        let price = '';
        let category = '';
        let variantId = '';

        switch (event) {
          case 'view_product':
            price = product?.price;
            category = product?.category;
            variantId = product?.variantId;
            break;
          case 'click_product':
            const variants = product.variants?.nodes;
            const selectedVariant =
              variants?.find(
                (variant: ProductVariantItemFragment) =>
                  variant.id === product?.defaultVariant?.reference?.id,
              ) ?? variants[0];
            variantId = selectedVariant.id;
            price = selectedVariant.price.amount;
            category = product.productType;
            break;
          default:
            return null;
        }

        return commonData({
          id,
          variantId,
          title,
          price,
          brand,
          category,
          index,
        });
      }),
    },
  };

  window.dataLayer.push(datas);
}

/*  */
/*  */
/*  */
/* Cart datas */
function GtmCartData(
  event: 'view_cart' | 'updated_cart' | 'add_to_cart' | 'remove_from_cart',
  data: CartUpdatePayload | CartViewPayload | CartLineUpdatePayload,
) {
  const {cart, shop} = data ?? {};
  const {currentLine, prevLine} = (data as CartLineUpdatePayload) ?? {};

  let value = null;
  let items = [];

  switch (event) {
    case 'view_cart':
    case 'updated_cart':
      value = cart;
      items = cart?.lines?.nodes ?? [];
      break;
    case 'add_to_cart':
      value = currentLine;
      items = [currentLine];
      break;
    case 'remove_from_cart':
      value = currentLine;
      items = [prevLine];
      break;
    default:
      return null;
  }

  const datas = {
    event,
    ecommerce: {
      value: value?.cost?.totalAmount?.amount,
      currency: shop?.currency,
      items: items?.map((item, index) => {
        const {quantity, merchandise} = item! ?? {};
        const {product, selectedOptions, id: variantId} = merchandise ?? {};
        const {id, title, vendor: brand, productType: category} = product ?? {};
        const price = merchandise?.price?.amount;
        const variant =
          merchandise.title === 'Default Title'
            ? title
            : selectedOptions?.[0].value;

        return {
          item_variant: variant,
          ...commonData({
            id,
            variantId,
            title,
            price,
            brand,
            category,
            index,
            quantity,
          }),
        };
      }),
    },
  };

  window.dataLayer.push(datas);
}
