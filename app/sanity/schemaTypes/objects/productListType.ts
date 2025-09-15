import {TagIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

const TITLE = 'Product List';

export const productList = defineType({
  name: 'productList',
  title: 'Product List',
  icon: TagIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      };
    },
  },
});
