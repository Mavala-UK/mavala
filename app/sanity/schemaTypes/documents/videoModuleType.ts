import {VideoIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

const TITLE = 'Module Vidéo';

export const videoModuleType = defineType({
  name: 'videoModule',
  title: TITLE,
  icon: VideoIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'text',
      title: 'Texte',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'video',
      title: 'Vidéo',
      type: 'video',
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
