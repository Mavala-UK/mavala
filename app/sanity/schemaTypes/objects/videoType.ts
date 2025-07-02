import {DocumentVideoIcon} from '@sanity/icons';
import {defineType} from 'sanity';

export const video = defineType({
  name: 'video',
  title: 'Vidéo',
  type: 'object',
  icon: DocumentVideoIcon,
  fields: [
    {
      title: 'Fichier',
      name: 'file',
      type: 'internationalizedArrayFile',
      validation: (Rule) => Rule.required(),
      options: {
        accept: 'video/*',
      },
    },
    {
      title: 'Vignette',
      name: 'poster',
      type: 'internationalizedArrayImage',
      description:
        'Image à afficher tant que la vidéo est en cours de téléchargement.',
    },
  ],
  preview: {
    select: {
      title: 'file.asset.originalFilename',
      media: 'poster',
    },
    prepare({title, media}) {
      return {
        title: title || 'Vidéo',
        media,
      };
    },
  },
});

export const bunnyVideo = defineType({
  name: 'bunnyVideo',
  title: 'Bunny Vidéo',
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
        title: `Bunny ID : ${id}` || 'Vidéo Bunny',
      };
    },
  },
});
