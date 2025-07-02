import {PresentationIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

const TITLE = 'Section éditoriale';

export const editorialSectionType = defineType({
  name: 'editorialSection',
  title: TITLE,
  icon: PresentationIcon,
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
      name: 'link',
      title: 'Lien',
      type: 'link',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Position de l’image',
      type: 'string',
      options: {
        list: [
          {title: 'Gauche', value: 'left'},
          {title: 'Droite', value: 'right'},
        ],
      },
      initialValue: 'left',
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
