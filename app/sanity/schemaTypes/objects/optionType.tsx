import {SunIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

export const optionType = defineType({
  title: 'Option de produit',
  name: 'option',
  type: 'object',
  icon: SunIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
    }),
    defineField({
      name: 'values',
      title: 'Valeurs',
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
