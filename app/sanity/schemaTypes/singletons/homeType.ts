import {HomeIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';
import {GROUPS, SITES} from '../../constants';

const TITLE = 'Home';

export const homeType = defineType({
  name: 'home',
  title: TITLE,
  type: 'document',
  icon: HomeIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'hero',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: 'featuredCollections',
      title: 'Featured Collections',
      type: 'featuredCollections',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'hotPicks',
      title: 'Hot Picks',
      type: 'hotPicks',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'editorialSection',
      title: 'Editorial Section',
      type: 'editorialSection',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'focusCollection',
      title: 'Featured Collection',
      type: 'focusCollection',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Featured Articles',
      type: 'featuredArticles',
      group: 'editorial',
      hidden: SITES?.isMavalaCorporate,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        media: HomeIcon,
        title: TITLE,
      };
    },
  },
});
