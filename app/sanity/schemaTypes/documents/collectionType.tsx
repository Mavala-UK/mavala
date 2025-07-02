import {PackageIcon} from '@sanity/icons';
import pluralize from 'pluralize-esm';
import {defineArrayMember, defineField, defineType} from 'sanity';
import {CollectionHiddenInput} from '../../components/CollectionHidden';
import {ShopifyDocumentStatus} from '../../components/ShopifyDocumentStatus';
import {GROUPS, SITES} from '../../constants';

export const collectionType = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: PackageIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'hidden',
      type: 'string',
      components: {
        field: CollectionHiddenInput,
      },
      hidden: ({parent}) => {
        const isDeleted = parent?.store?.isDeleted;
        return !isDeleted;
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
      type: 'shopifyCollection',
      description: 'Données de collection provenant de Shopify (lecture seule)',
      group: 'shopifySync',
    }),
    defineField({
      name: 'insert',
      title: 'Encart',
      type: 'insert',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'seoSection',
      title: 'Section SEO',
      type: 'seoSection',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
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
      name: 'additionalBlocks',
      title: 'Blocs additionnels',
      type: 'array',
      group: 'additional',
      of: [
        defineArrayMember({type: 'featuredCollections'}),
        defineArrayMember({type: 'hotPicks'}),
        defineArrayMember({type: 'videoModule'}),
        defineArrayMember({type: 'focusCollection'}),
        defineArrayMember({type: 'editorialSection'}),
      ],
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
  ],
  preview: {
    select: {
      imageUrl: 'store.imageUrl',
      isDeleted: 'store.isDeleted',
      rules: 'store.rules',
      title: 'store.title',
    },
    prepare({imageUrl, isDeleted, rules, title}) {
      const ruleCount = rules?.length || 0;

      return {
        media: (
          <ShopifyDocumentStatus
            isDeleted={isDeleted}
            type="collection"
            url={imageUrl}
            title={title}
          />
        ),
        subtitle:
          ruleCount > 0
            ? `Automatique (${pluralize('règle', ruleCount, true)})`
            : 'Manuel',
        title,
      };
    },
  },
});
