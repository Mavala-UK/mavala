import {TagIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

const TITLE = 'Liste de produits';

export const productList = defineType({
  name: 'productList',
  title: 'Liste de produits',
  icon: TagIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'products',
      title: 'Produits',
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
