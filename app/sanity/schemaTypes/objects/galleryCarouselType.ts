import {ImagesIcon, ImageIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';
import {video} from './videoType';

const TITLE = 'Galerie de médias';

export const galleryCarousel = defineType({
  name: 'galleryCarousel',
  title: TITLE,
  icon: ImagesIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'medias',
      title: 'Medias',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          title: 'Image',
          name: 'image',
          icon: ImageIcon,
        }),
        defineArrayMember({
          ...video,
          name: 'videoGallery',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      media: 'medias.0.asset',
      poster: 'medias.0.poster',
      type: 'medias.0._type',
    },
    prepare({media, poster, type}) {
      return {
        title: TITLE,
        media: type === 'video' && poster ? poster : media,
      };
    },
  },
});
