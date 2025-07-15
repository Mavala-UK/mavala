import {PresentationIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

const TITLE = 'Editorial Section';

export const editorialSectionType = defineType({
  name: 'editorialSection',
  title: TITLE,
  icon: PresentationIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
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
