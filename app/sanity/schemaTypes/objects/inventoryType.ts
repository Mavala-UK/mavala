import {defineField, defineType} from 'sanity';

export const inventoryType = defineType({
  name: 'inventory',
  title: 'Inventaire',
  type: 'object',
  options: {
    columns: 3,
  },
  fields: [
    defineField({
      name: 'isAvailable',
      title: 'Disponible',
      type: 'boolean',
    }),
    defineField({
      name: 'management',
      title: 'Gestion',
      type: 'string',
    }),
    defineField({
      name: 'policy',
      title: 'Politique',
      type: 'string',
    }),
  ],
});
