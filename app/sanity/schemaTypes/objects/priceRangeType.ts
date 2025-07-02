import {defineField, defineType} from 'sanity';

export const priceRangeType = defineType({
  name: 'priceRange',
  title: 'Fourchette de prix',
  type: 'object',
  options: {
    columns: 2,
  },
  fields: [
    defineField({
      name: 'minVariantPrice',
      title: 'Prix minimum',
      type: 'number',
    }),
    defineField({
      name: 'maxVariantPrice',
      title: 'Prix maximum',
      type: 'number',
    }),
  ],
});
