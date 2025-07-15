import {SunIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

export const optionType = defineType({
  title: 'Product Option',
  name: 'option',
  type: 'object',
  icon: SunIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare({name}) {
      return {
        title: name,
      };
    },
  },
});
