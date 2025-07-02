import {BookIcon, DocumentIcon} from '@sanity/icons';
import {defineField, defineType, defineArrayMember} from 'sanity';
import {GROUPS} from '../../constants';
import {validateSlug} from '../../utils/validateSlug';

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: BookIcon,
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
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
      group: 'editorial',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      to: [{type: 'articleCategory'}],
      validation: (Rule) => Rule.required(),
      group: 'editorial',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'internationalizedArrayText',
      group: 'editorial',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'sections',
      title: 'Contenus',
      group: 'editorial',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            defineField({
              name: 'title',
              title: 'Titre sommaire',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Contenu section',
              type: 'internationalizedArrayPortableTextArticle',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title.0.value',
            },
            prepare({title}) {
              return {
                title: title ?? 'Sans titre',
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'relatedCategories',
      title: 'Catégories liées',
      group: 'editorial',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'collection'}]})],
      validation: (Rule) => Rule.max(3),
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
      subtitle: 'category.title.0.value',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle,
        media: media ?? DocumentIcon,
      };
    },
  },
});
