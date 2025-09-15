import {defineField, defineType, defineArrayMember} from 'sanity';
import {HelpCircleIcon} from '@sanity/icons';

export const faqSectionType = defineType({
  name: 'faqSection',
  title: 'FAQ Section',
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
              title: `Title`,
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
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
                title: title ?? 'Untitled',
                media: HelpCircleIcon,
              };
            },
          },
        }),
      ],
    }),
  ],
});
