import {SparkleIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';
import {GROUPS} from '../../constants';

const TITLE = 'Article Launchers';

export const articleLauncherType = defineType({
  name: 'articleLauncher',
  title: TITLE,
  type: 'document',
  icon: SparkleIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'internationalizedArrayString',
      group: 'editorial',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredArticles',
      title: 'Featured Articles',
      type: 'featuredArticles',
      group: 'editorial',
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
