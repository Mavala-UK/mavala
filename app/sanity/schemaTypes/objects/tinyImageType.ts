import {ImageIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

const TITLE = 'Petit média';

export const tinyImage = defineType({
  name: 'tinyImage',
  title: TITLE,
  icon: ImageIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: '(Ratio carré)',
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
