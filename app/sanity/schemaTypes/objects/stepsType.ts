import {ListIcon, ImageIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

const TITLE = 'Étapes';

export const steps = defineType({
  name: 'steps',
  title: TITLE,
  icon: ListIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'steps',
      title: 'Étapes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          title: 'Étape',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: `Titre de l'étape`,
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'internationalizedArrayText',
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
                title: title ?? 'Sans titre',
                media: media ?? ImageIcon,
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
