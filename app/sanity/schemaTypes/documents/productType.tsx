import {TagIcon} from '@sanity/icons';
import pluralize from 'pluralize-esm';
import {defineField, defineType} from 'sanity';
import {ProductHiddenInput} from '../../components/ProductHidden';
import {ShopifyDocumentStatus} from '../../components/ShopifyDocumentStatus';
import {GROUPS, SITES} from '../../constants';
import {getPriceRange} from '../../utils/getPriceRange';

export const productType = defineType({
  name: 'product',
  title: 'Produit',
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
      title: 'Titre',
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
      description: 'Données du produit provenant de Shopify (lecture seule)',
      group: 'shopifySync',
    }),
    defineField({
      name: 'faqSection',
      title: 'Section FAQ',
      type: 'faqSection',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Articles mis en avant',
      type: 'featuredArticles',
      group: 'editorial',
      hidden: SITES?.isMavalaCorporate,
    }),
  ],
  orderings: [
    {
      name: 'titleAsc',
      title: 'Titre (A-Z)',
      by: [{field: 'store.title', direction: 'asc'}],
    },
    {
      name: 'titleDesc',
      title: 'Titre (Z-A)',
      by: [{field: 'store.title', direction: 'desc'}],
    },
    {
      name: 'priceDesc',
      title: 'Prix (du plus élevé au plus bas)',
      by: [{field: 'store.priceRange.minVariantPrice', direction: 'desc'}],
    },
    {
      name: 'priceAsc',
      title: 'Prix (du plus bas au plus élevé)',
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
        variantCount
          ? pluralize('variante', variantCount, true)
          : 'Aucune variante',
        optionCount ? pluralize('option', optionCount, true) : 'Aucune option',
      ];

      let subtitle = '';
      
      try {
        subtitle = getPriceRange(priceRange);
      } catch (error) {
        console.warn('Error getting price range for product:', title, error);
        subtitle = 'Prix non disponible';
      }

      if (status !== 'active') {
        subtitle = '(Indisponible sur Shopify)';
      }
      if (isDeleted) {
        subtitle = '(Supprimé de Shopify)';
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
