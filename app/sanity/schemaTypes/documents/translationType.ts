import {TranslateIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'translation',
  title: 'Translation',
  icon: TranslateIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Identifier',
      type: 'slug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'message.0.value',
      subtitle: 'message.1.value',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle,
      };
    },
  },
});
