import {ProjectsIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

const TITLE = 'Sélection du moment';

export const hotPicksType = defineType({
  name: 'hotPicks',
  title: TITLE,
  icon: ProjectsIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'collection'}]})],
      validation: (Rule) => Rule.max(3),
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
