import {FilterIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

export const collectionRuleType = defineType({
  name: 'collectionRule',
  title: 'Collection Rule',
  type: 'object',
  icon: FilterIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'column',
      title: 'Column',
      type: 'string',
    }),
    defineField({
      name: 'relation',
      title: 'Relation',
      type: 'string',
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      condition: 'condition',
      name: 'column',
      relation: 'relation',
    },
    prepare({condition, name, relation}) {
      return {
        subtitle: `${relation} ${condition}`,
        title: name,
      };
    },
  },
});
