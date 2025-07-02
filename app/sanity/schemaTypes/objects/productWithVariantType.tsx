import {TagIcon} from '@sanity/icons';
import pluralize from 'pluralize-esm';
import {defineField, defineType} from 'sanity';
import {ShopifyDocumentStatus} from '../../components/ShopifyDocumentStatus';
import {SANITY_API_VERSION} from '../../constants';
import {getPriceRange} from '../../utils/getPriceRange';

export const productWithVariantType = defineType({
  name: 'productWithVariant',
  title: 'Produit avec variante',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'product',
      title: 'Produit',
      type: 'reference',
      to: [{type: 'product'}],
      weak: true,
    }),
    defineField({
      name: 'variant',
      title: 'Variante',
      type: 'reference',
      to: [{type: 'productVariant'}],
      weak: true,
      description:
        'La première variante sera sélectionnée si elle est laissée vide',
      options: {
        filter: ({parent}) => {
          // @ts-ignore
          const productId = parent?.product?._ref;
          const shopifyProductId = Number(
            productId?.replace('shopifyProduct-', ''),
          );

          if (!shopifyProductId) {
            return {filter: '', params: {}};
          }

          // TODO: once variants are correctly marked as deleted, this could be made a little more efficient
          // e.g. filter: 'store.productId == $shopifyProductId && !store.isDeleted',
          return {
            filter: `_id in *[_id == $shopifyProductId][0].store.variants[]._ref`,
            params: {
              shopifyProductId: productId,
            },
          };
        },
      },
      hidden: ({parent}) => {
        const productSelected = parent?.product;
        return !productSelected;
      },
      validation: (Rule) =>
        Rule.custom(async (value, {parent, getClient}) => {
          // Selected product in adjacent `product` field
          // @ts-ignore
          const productId = parent?.product?._ref;

          // Selected product variant
          const productVariantId = value?._ref;

          if (!productId || !productVariantId) {
            return true;
          }

          // If both product + product variant are specified,
          // check to see if `product` references this product variant.
          const result = await getClient({
            apiVersion: SANITY_API_VERSION,
          }).fetch(
            `*[_id == $productId && references($productVariantId)][0]._id`,
            {
              productId,
              productVariantId,
            },
          );

          return result ? true : 'La variante de produit est invalide';
        }),
    }),
  ],
  preview: {
    select: {
      defaultVariantTitle: 'product.store.variants.0.store.title',
      isDeleted: 'product.store.isDeleted',
      optionCount: 'product.store.options.length',
      previewImageUrl: 'product.store.previewImageUrl',
      priceRange: 'product.store.priceRange',
      status: 'product.store.status',
      title: 'product.store.title',
      variantCount: 'product.store.variants.length',
      variantPreviewImageUrl: 'variant.store.previewImageUrl',
      variantTitle: 'variant.store.title',
    },
    prepare(selection) {
      const {
        defaultVariantTitle,
        isDeleted,
        optionCount,
        previewImageUrl,
        priceRange,
        status,
        title,
        variantCount,
        variantPreviewImageUrl,
        variantTitle,
      } = selection;

      const productVariantTitle = variantTitle || defaultVariantTitle;

      const previewTitle = [title];
      if (productVariantTitle) {
        previewTitle.push(`[${productVariantTitle}]`);
      }

      const description = [
        variantCount
          ? pluralize('variante', variantCount, true)
          : 'Aucune variante',
        optionCount ? pluralize('option', optionCount, true) : 'Aucune option',
      ];

      let subtitle = getPriceRange(priceRange);
      if (status !== 'active') {
        subtitle = '(Indisponible sur Shopify)';
      }
      if (isDeleted) {
        subtitle = '(Supprimé de Shopify)';
      }

      return {
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="product"
            url={variantPreviewImageUrl || previewImageUrl}
            title={previewTitle.join(' ')}
          />
        ),
        description: description.join(' / '),
        subtitle,
        title: previewTitle.join(' '),
      };
    },
  },
});
