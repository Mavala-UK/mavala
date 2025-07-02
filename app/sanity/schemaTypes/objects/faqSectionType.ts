import {defineField, defineType, defineArrayMember} from 'sanity';
import {HelpCircleIcon} from '@sanity/icons';

export const faqSectionType = defineType({
  name: 'faqSection',
  title: 'Section FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'questions',
          title: 'Question',
          fields: [
            defineField({
              name: 'title',
              title: `Titre`,
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'internationalizedArrayPortableText',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title.0.value',
            },
            prepare({title}) {
              return {
                title: title ?? 'Sans titre',
                media: HelpCircleIcon,
              };
            },
          },
        }),
      ],
    }),
  ],
});
