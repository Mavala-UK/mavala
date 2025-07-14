import {TagIcon} from '@sanity/icons';
import pluralize from 'pluralize-esm';
import {defineField, defineType} from 'sanity';
import {ProductHiddenInput} from '../../components/ProductHidden';
import {ShopifyDocumentStatus} from '../../components/ShopifyDocumentStatus';
import {GROUPS, SITES} from '../../constants';
import {getPriceRange} from '../../utils/getPriceRange';

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'hidden',
      type: 'string',
      components: {
        field: ProductHiddenInput,
      },
      group: GROUPS.filter((group) => group.name !== 'editorial').map(
        (group) => group.name,
      ),
      hidden: ({parent}) => {
        const isActive = parent?.store?.status === 'active';
        const isDeleted = parent?.store?.isDeleted;
        return !parent?.store || (isActive && !isDeleted);
      },
    }),
    defineField({
      name: 'titleProxy',
      title: 'Title',
      type: 'proxyString',
      options: {field: 'store.title'},
    }),
    defineField({
      name: 'slugProxy',
      title: 'Slug',
      type: 'proxyString',
      options: {field: 'store.slug.current'},
    }),
    defineField({
      name: 'store',
      title: 'Shopify',
      type: 'shopifyProduct',
      description: 'Product data from Shopify (read-only)',
      group: 'shopifySync',
    }),
    defineField({
      name: 'faqSection',
      title: 'FAQ Section',
      type: 'faqSection',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Featured Articles',
      type: 'featuredArticles',
      group: 'editorial',
      hidden: SITES?.isMavalaCorporate,
    }),
  ],
  orderings: [
    {
      name: 'titleAsc',
      title: 'Title (A-Z)',
      by: [{field: 'store.title', direction: 'asc'}],
    },
    {
      name: 'titleDesc',
      title: 'Title (Z-A)',
      by: [{field: 'store.title', direction: 'desc'}],
    },
    {
      name: 'priceDesc',
      title: 'Price (High to Low)',
      by: [{field: 'store.priceRange.minVariantPrice', direction: 'desc'}],
    },
    {
      name: 'priceAsc',
      title: 'Price (Low to High)',
      by: [{field: 'store.priceRange.minVariantPrice', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      options: 'store.options',
      previewImageUrl: 'store.previewImageUrl',
      priceRange: 'store.priceRange',
      status: 'store.status',
      title: 'store.title',
      variants: 'store.variants',
    },
    prepare(selection) {
      const {
        isDeleted,
        options,
        previewImageUrl,
        priceRange,
        status,
        title,
        variants,
      } = selection;

      const optionCount = options?.length;
      const variantCount = variants?.length;

      const description = [
        variantCount ? pluralize('variant', variantCount, true) : 'No variants',
        optionCount ? pluralize('option', optionCount, true) : 'No options',
      ];

      let subtitle = '';

      try {
        subtitle = getPriceRange(priceRange);
      } catch (error) {
        console.warn('Error getting price range for product:', title, error);
        subtitle = 'Price unavailable';
      }

      if (status !== 'active') {
        subtitle = '(Unavailable on Shopify)';
      }
      if (isDeleted) {
        subtitle = '(Deleted from Shopify)';
      }

      return {
        description: description.join(' / '),
        subtitle,
        title,
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
            title={title}
          />
        ),
      };
    },
  },
});
