import {VideoIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

const TITLE = 'Video Module';

export const videoModuleType = defineType({
  name: 'videoModule',
  title: TITLE,
  icon: VideoIcon,
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
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'video',
      title: 'Video',
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
