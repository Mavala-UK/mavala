import {SplitHorizontalIcon} from '@sanity/icons';
import {defineField, defineType, defineArrayMember} from 'sanity';

const TITLE = 'Image and Text Carousel';

export const imageWithTextCarousel = defineType({
  name: 'imageWithTextCarousel',
  title: TITLE,
  icon: SplitHorizontalIcon,
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
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'internationalizedArrayText',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'text.0.value',
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
