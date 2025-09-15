import {DEFAULT_CURRENCY_CODE, LANGUAGES} from '../constants';

type PriceObject = {
  minVariantPrice: number;
  maxVariantPrice: number;
};

const formatNumber = (val: number) => {
  const currencyCode = DEFAULT_CURRENCY_CODE || 'GBP';
  const locale = LANGUAGES[0]?.id ?? 'en';

  return new Intl.NumberFormat(locale, {
    currency: currencyCode,
    style: 'currency',
  }).format(val);
};

export const getPriceRange = (price: PriceObject) => {
  if (
    !price ||
    typeof price?.minVariantPrice === 'undefined' ||
    price?.minVariantPrice === null
  ) {
    return 'No price found';
  }

  try {
    if (
      price.maxVariantPrice &&
      typeof price.maxVariantPrice === 'number' &&
      price.minVariantPrice !== price.maxVariantPrice
    ) {
      return `${formatNumber(price.minVariantPrice)} – ${formatNumber(
        price.maxVariantPrice,
      )}`;
    }

    return formatNumber(price.minVariantPrice);
  } catch (error) {
    console.warn('Error formatting price range:', error);
    return 'Price unavailable';
  }
};
