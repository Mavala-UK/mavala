import {defineField, defineType} from 'sanity';

export const seoSectionType = defineType({
  name: 'seoSection',
  title: 'Section SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'text',
      title: 'Texte',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
});
