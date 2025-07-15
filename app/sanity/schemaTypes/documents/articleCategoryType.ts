import {FilterIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';
import {GROUPS} from '../../constants';
import {validateSlug} from '../../utils/validateSlug';

export const articleCategoryType = defineType({
  name: 'articleCategory',
  title: 'Article Category',
  type: 'document',
  icon: FilterIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
      group: 'editorial',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.0.value'},
      validation: validateSlug,
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
        title,
      };
    },
  },
});
