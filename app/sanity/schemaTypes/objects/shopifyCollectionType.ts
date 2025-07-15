import {defineField, defineType} from 'sanity';

export const shopifyCollectionType = defineType({
  name: 'shopifyCollection',
  title: 'Shopify',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  readOnly: true,
  fieldsets: [
    {
      name: 'status',
      title: 'Status',
    },
  ],
  fields: [
    defineField({
      fieldset: 'status',
      name: 'createdAt',
      title: 'Created Date',
      type: 'string',
    }),
    defineField({
      fieldset: 'status',
      name: 'updatedAt',
      title: 'Updated Date',
      type: 'string',
    }),
    defineField({
      fieldset: 'status',
      name: 'isDeleted',
      title: 'Deleted from Shopify?',
      type: 'boolean',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'Shopify collection ID',
    }),
    defineField({
      name: 'gid',
      title: 'GID',
      type: 'string',
      description: 'Shopify collection GID',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Shopify collection handle',
    }),
    defineField({
      name: 'descriptionHtml',
      title: 'Description HTML',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'string',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'string',
    }),
    defineField({
      name: 'rules',
      title: 'Rules',
      type: 'array',
      of: [{type: 'collectionRule'}],
    }),
    defineField({
      name: 'disjunctive',
      title: 'Disjunctive Rules?',
      type: 'boolean',
      description:
        'If true, products must match only one rule. If false, products must match all rules.',
    }),
  ],
});
