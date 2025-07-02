import {defineArrayMember, defineField, defineType} from 'sanity';
import {ImageIcon} from '@sanity/icons';
import {SITES} from '../../constants';
import {video, bunnyVideo} from './videoType';

export const heroType = defineType({
  name: 'hero',
  title: 'Section hero',
  type: 'object',
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'slide',
          title: 'Slide',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              hidden: SITES?.isMavalaCorporate,
            }),
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
                  ...bunnyVideo,
                  name: 'bunnyVideoMedias',
                }),
              ],
              hidden: SITES?.isMavalaFrance,
              validation: (Rule) => Rule.max(1),
            }),
            defineField({
              name: 'mediasMobile',
              title: 'Medias Mobile',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'image',
                  title: 'Image',
                  name: 'image',
                  icon: ImageIcon,
                }),
                defineArrayMember({
                  ...bunnyVideo,
                  name: 'bunnyVideoMediasMobile',
                }),
              ],
              hidden: SITES?.isMavalaFrance,
              validation: (Rule) => Rule.max(1),
            }),
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'linkReferences',
              title: 'Lien',
              type: 'array',
              of: [
                defineArrayMember({type: 'link'}),
                defineArrayMember({
                  title: 'Produit',
                  type: 'reference',
                  to: [{type: 'product'}],
                }),
              ],
              hidden: SITES?.isMavalaCorporate,
              validation: (Rule) => Rule.max(1),
            }),
            defineField({
              name: 'link',
              title: 'Lien',
              type: 'link',
              hidden: SITES?.isMavalaFrance,
            }),
          ],
          preview: {
            select: {
              title: 'title.0.value',
              image: 'image',
              medias: 'medias.0.asset',
              video: 'medias.0.poster',
            },
            prepare({title, image, medias, video}) {
              return {
                title,
                media: image ?? medias ?? video,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
});
