import {DocumentIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';
import {GROUPS, SITES} from '../../constants';
import {validateSlug} from '../../utils/validateSlug';

const TITLE = 'Page';

export const pageType = defineType({
  name: 'page',
  title: TITLE,
  type: 'document',
  icon: DocumentIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
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
      name: 'introTitle',
      title: 'Titre introduction',
      type: 'internationalizedArrayText',
      group: 'editorial',
    }),
    defineField({
      name: 'introDescription',
      title: 'Description introduction',
      type: 'internationalizedArrayText',
      group: 'editorial',
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'internationalizedArrayPortableTextEditorial',
      group: 'editorial',
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
    select: {
      title: 'title.0.value',
      media: 'seo.image.0.value',
    },
    prepare({title, media}) {
      return {
        title: title || TITLE,
        media,
      };
    },
  },
});
