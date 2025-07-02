import {ImageIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'imageWithAltText',
  title: 'Image avec alternative textuelle',
  icon: ImageIcon,
  type: 'image',
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative textuelle',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'asset',
    },
    prepare({title, media}) {
      return {
        title,
        media,
      };
    },
  },
});
