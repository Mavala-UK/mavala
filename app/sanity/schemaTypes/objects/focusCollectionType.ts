import {SparklesIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

const TITLE = 'Mise en avant collection';

export const focusCollectionType = defineType({
  name: 'focusCollection',
  title: TITLE,
  icon: SparklesIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{type: 'collection'}],
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
