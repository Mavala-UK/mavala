import {defineArrayMember, defineField, defineType} from 'sanity';

export const shopifyProductType = defineType({
  name: 'shopifyProduct',
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
    {
      name: 'organization',
      title: 'Organization',
      options: {
        columns: 2,
      },
    },
    {
      name: 'variants',
      title: 'Variants',
      options: {
        collapsed: true,
        collapsible: true,
      },
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        layout: 'dropdown',
        list: ['active', 'archived', 'draft'],
      },
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
      description: 'Title displayed in cart and checkout',
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'Shopify product ID',
    }),
    defineField({
      name: 'gid',
      title: 'GID',
      type: 'string',
      description: 'Shopify product GID',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Shopify product handle',
    }),
    defineField({
      name: 'descriptionHtml',
      title: 'Description HTML',
      type: 'text',
      rows: 5,
    }),
    defineField({
      fieldset: 'organization',
      name: 'productType',
      title: 'Product Type',
      type: 'string',
    }),
    defineField({
      fieldset: 'organization',
      name: 'vendor',
      title: 'Vendor',
      type: 'string',
    }),
    defineField({
      fieldset: 'organization',
      name: 'tags',
      title: 'Tags',
      type: 'string',
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'priceRange',
    }),
    defineField({
      name: 'previewImageUrl',
      title: 'Preview Image URL',
      type: 'string',
      description: 'Image displayed in cart and checkout',
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{type: 'option'}],
    }),
    defineField({
      fieldset: 'variants',
      name: 'variants',
      title: 'Variants',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Variant',
          type: 'reference',
          weak: true,
          to: [{type: 'productVariant'}],
        }),
      ],
    }),
  ],
});
