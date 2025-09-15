import {defineArrayMember, defineField, defineType} from 'sanity';

export const insertType = defineType({
  name: 'insert',
  title: 'Insert',
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
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
    }),
  ],
});
