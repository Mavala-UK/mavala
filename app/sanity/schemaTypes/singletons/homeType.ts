import {HomeIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';
import {GROUPS, SITES} from '../../constants';

const TITLE = 'Accueil';

export const homeType = defineType({
  name: 'home',
  title: TITLE,
  type: 'document',
  icon: HomeIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'hero',
      title: 'Section hero',
      type: 'hero',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: 'featuredCollections',
      title: 'Collections en vedette',
      type: 'featuredCollections',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'hotPicks',
      title: 'Sélection du moment',
      type: 'hotPicks',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'editorialSection',
      title: 'Section éditoriale',
      type: 'editorialSection',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'focusCollection',
      title: 'Mise en avant collection',
      type: 'focusCollection',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Articles mis en avant',
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
