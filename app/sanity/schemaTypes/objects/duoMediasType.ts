import {InlineIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

const TITLE = 'Duo de médias';

export const duoMedias = defineType({
  name: 'duoMedias',
  title: TITLE,
  icon: InlineIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'largeImage',
      title: 'Image large',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'smallImage',
      title: 'Image small',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Position',
      type: 'string',
      options: {
        list: [
          {title: 'Gauche', value: 'left'},
          {title: 'Droite', value: 'right'},
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
