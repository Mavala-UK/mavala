import {LinkIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';
import {PAGE_REFERENCES} from '~/sanity/constants';

export const linkType = defineType({
  name: 'link',
  title: 'Lien',
  type: 'object',
  icon: LinkIcon,
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Interne', value: 'internal'},
          {title: 'Externe', value: 'external'},
          {title: 'E-mail', value: 'email'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      weak: true,
      to: PAGE_REFERENCES,
      hidden: ({parent}) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
      hidden: ({parent}) => parent?.type !== 'external',
    }),
    defineField({
      name: 'email',
      title: 'Adresse e-mail',
      type: 'email',
      hidden: ({parent}) => parent?.type !== 'email',
    }),
    defineField({
      name: 'text',
      title: 'Texte',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text.0.value',
    },
    prepare({title}) {
      return {
        title,
      };
    },
  },
});
