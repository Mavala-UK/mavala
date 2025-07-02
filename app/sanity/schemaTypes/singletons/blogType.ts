import {SparkleIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';
import {GROUPS} from '../../constants';

const TITLE = 'Conseils et astuces';

export const blogType = defineType({
  name: 'blog',
  title: TITLE,
  type: 'document',
  icon: SparkleIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'internationalizedArrayString',
      group: 'editorial',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'internationalizedArrayText',
      group: 'editorial',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title.0.value',
    },
    prepare({title}) {
      return {
        title: title || TITLE,
      };
    },
  },
});
