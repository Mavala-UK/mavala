import {DocumentVideoIcon} from '@sanity/icons';
import {defineType} from 'sanity';

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: DocumentVideoIcon,
  fields: [
    {
      title: 'File',
      name: 'file',
      type: 'internationalizedArrayFile',
      validation: (Rule) => Rule.required(),
      options: {
        accept: 'video/*',
      },
    },
    {
      title: 'Thumbnail',
      name: 'poster',
      type: 'internationalizedArrayImage',
      description: 'Image to display while the video is downloading.',
    },
  ],
  preview: {
    select: {
      title: 'file.asset.originalFilename',
      media: 'poster',
    },
    prepare({title, media}) {
      return {
        title: title || 'Video',
        media,
      };
    },
  },
});

export const bunnyVideo = defineType({
  name: 'bunnyVideo',
  title: 'Bunny Video',
  type: 'object',
  icon: DocumentVideoIcon,
  fields: [
    {
      title: 'Bunny ID',
      name: 'id',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      id: 'id',
    },
    prepare({id}) {
      return {
        title: `Bunny ID: ${id}` || 'Bunny Video',
      };
    },
  },
});
