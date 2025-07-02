import {DEFAULT_CURRENCY_CODE, LANGUAGES} from '../constants';

type PriceObject = {
  minVariantPrice: number;
  maxVariantPrice: number;
};

const formatNumber = (val: number) => {
  return new Intl.NumberFormat(LANGUAGES[0].id ?? 'fr', {
    currency: DEFAULT_CURRENCY_CODE,
    style: 'currency',
  }).format(val);
};

export const getPriceRange = (price: PriceObject) => {
  if (!price || typeof price?.minVariantPrice === 'undefined') {
    return 'Aucun prix trouvé';
  }
  if (
    price.maxVariantPrice &&
    price.minVariantPrice !== price.maxVariantPrice
  ) {
    return `${formatNumber(price.minVariantPrice)} – ${formatNumber(
      price.maxVariantPrice,
    )}`;
  }

  return formatNumber(price.minVariantPrice);
};
