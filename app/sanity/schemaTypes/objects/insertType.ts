import {defineArrayMember, defineField, defineType} from 'sanity';

export const insertType = defineType({
  name: 'insert',
  title: 'Encart',
  type: 'object',
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'link',
      title: 'Lien',
      type: 'link',
    }),
  ],
});
