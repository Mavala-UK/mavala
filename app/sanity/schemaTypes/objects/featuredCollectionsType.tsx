import {PackageIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

const TITLE = 'Collection en vedette';

export const featuredCollectionsType = defineType({
  name: 'featuredCollections',
  title: TITLE,
  icon: PackageIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'internationalizedArrayString',
      hidden: ({document}) => {
        return document?._type === 'collection';
      },
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'collection'}]})],
      validation: (Rule) => Rule.min(3),
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
