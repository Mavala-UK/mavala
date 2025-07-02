import {SparkleIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';
import {GROUPS} from '../../constants';

const TITLE = "Lanceurs d'articles";

export const articleLauncherType = defineType({
  name: 'articleLauncher',
  title: TITLE,
  type: 'document',
  icon: SparkleIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'shortDescription',
      title: 'Description courte',
      type: 'internationalizedArrayString',
      group: 'editorial',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredArticles',
      title: 'Articles mis en avant',
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
