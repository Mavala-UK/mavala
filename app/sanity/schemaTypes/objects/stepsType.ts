import {ListIcon, ImageIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

const TITLE = 'Steps';

export const steps = defineType({
  name: 'steps',
  title: TITLE,
  icon: ListIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          title: 'Step',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'internationalizedArrayText',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title.0.value',
              media: 'image',
            },
            prepare({title, media}) {
              return {
                title: title || 'Step',
                media,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(4),
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
