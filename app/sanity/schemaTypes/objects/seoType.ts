import {defineField, defineType} from 'sanity';

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {
    collapsed: true,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.max(50).warning(
          'Les titres plus longs peuvent être tronqués par les moteurs de recherche',
        ),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      validation: (Rule) =>
        Rule.max(150).warning(
          'Les descriptions plus longues peuvent être tronquées par les moteurs de recherche',
        ),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'internationalizedArrayImageWithAltText',
    }),
  ],
});
