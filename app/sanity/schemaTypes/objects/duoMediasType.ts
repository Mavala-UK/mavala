import {InlineIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

const TITLE = 'Media Duo';

export const duoMedias = defineType({
  name: 'duoMedias',
  title: TITLE,
  icon: InlineIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'largeImage',
      title: 'Large Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'smallImage',
      title: 'Small Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
      validation: (Rule) => Rule.required(),
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
