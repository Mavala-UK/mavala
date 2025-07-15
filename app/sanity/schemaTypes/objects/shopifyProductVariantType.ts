import {defineField, defineType} from 'sanity';

export const shopifyProductVariantType = defineType({
  name: 'shopifyProductVariant',
  title: 'Shopify',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fieldsets: [
    {
      name: 'options',
      title: 'Options',
      options: {
        columns: 3,
      },
    },
    {
      name: 'status',
      title: 'Status',
    },
  ],
  fields: [
    defineField({
      fieldset: 'status',
      name: 'createdAt',
      type: 'string',
      title: 'Created Date',
    }),
    defineField({
      fieldset: 'status',
      name: 'updatedAt',
      type: 'string',
      title: 'Updated Date',
    }),
    defineField({
      fieldset: 'status',
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        layout: 'dropdown',
        list: ['archived', 'draft', 'active'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      fieldset: 'status',
      name: 'isDeleted',
      title: 'Deleted from Shopify?',
      type: 'boolean',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'Shopify product variant ID',
    }),
    defineField({
      name: 'gid',
      title: 'GID',
      type: 'string',
      description: 'Shopify product variant GID',
    }),
    defineField({
      name: 'productId',
      title: 'Product ID',
      type: 'number',
    }),
    defineField({
      name: 'productGid',
      title: 'Product GID',
      type: 'string',
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Price',
    }),
    defineField({
      name: 'compareAtPrice',
      type: 'number',
      title: 'Compare at Price',
    }),
    defineField({
      name: 'inventory',
      type: 'inventory',
      options: {
        columns: 3,
      },
      title: 'Inventory',
    }),
    defineField({
      fieldset: 'options',
      name: 'option1',
      type: 'string',
      title: 'Option 1',
    }),
    defineField({
      fieldset: 'options',
      name: 'option2',
      type: 'string',
      title: 'Option 2',
    }),
    defineField({
      fieldset: 'options',
      name: 'option3',
      type: 'string',
      title: 'Option 3',
    }),
    // Preview image URL
    defineField({
      name: 'previewImageUrl',
      title: 'Preview Image URL',
      type: 'string',
      description: 'Image displayed in cart and checkout',
    }),
  ],
  readOnly: true,
});
