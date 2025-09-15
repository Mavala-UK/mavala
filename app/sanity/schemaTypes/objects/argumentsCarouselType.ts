import {MasterDetailIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

const TITLE = `Arguments Carousel`;

export const argumentsCarousel = defineType({
  name: 'argumentsCarousel',
  title: TITLE,
  icon: MasterDetailIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
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
              name: 'title',
              title: 'Title',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'internationalizedArrayText',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'sizeText',
              title: 'Text Size',
              type: 'string',
              options: {
                list: [
                  {title: 'Large', value: 'large'},
                  {title: 'Small', value: 'small'},
                ],
              },
              initialValue: 'large',
              validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.max(5),
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
