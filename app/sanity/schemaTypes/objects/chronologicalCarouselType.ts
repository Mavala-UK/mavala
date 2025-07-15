import {TimelineIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

const TITLE = 'Carousel chronologique';

export const chronologicalCarousel = defineType({
  name: 'chronologicalCarousel',
  title: TITLE,
  icon: TimelineIcon,
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
            }),
            defineField({
              name: 'year',
              title: 'Year',
              type: 'number',
              validation: (Rule) =>
                Rule.integer().positive().max(new Date().getFullYear()),
            }),
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'internationalizedArrayText',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title.0.value',
              media: 'image',
            },
            prepare({title, media}) {
              return {
                title,
                media,
              };
            },
          },
        }),
      ],
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
