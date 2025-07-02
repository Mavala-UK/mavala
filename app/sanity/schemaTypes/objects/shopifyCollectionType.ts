import {defineField, defineType} from 'sanity';

export const shopifyCollectionType = defineType({
  name: 'shopifyCollection',
  title: 'Shopify',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  readOnly: true,
  fieldsets: [
    {
      name: 'status',
      title: 'Statut',
    },
  ],
  fields: [
    defineField({
      fieldset: 'status',
      name: 'createdAt',
      title: 'Date de création',
      type: 'string',
    }),
    defineField({
      fieldset: 'status',
      name: 'updatedAt',
      title: 'Date de mise à jour',
      type: 'string',
    }),
    defineField({
      fieldset: 'status',
      name: 'isDeleted',
      title: 'Supprimé de Shopify ?',
      type: 'boolean',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'ID de la collection Shopify',
    }),
    defineField({
      name: 'gid',
      title: 'GID',
      type: 'string',
      description: 'GID de la collection Shopify',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Handle de la collection Shopify',
      type: 'slug',
    }),
    defineField({
      name: 'descriptionHtml',
      title: 'Description HTML',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'imageUrl',
      title: 'URL de l’image',
      type: 'string',
    }),
    defineField({
      name: 'rules',
      title: 'Règles',
      type: 'array',
      description: 'Inclure les produits Shopify qui satisfont ces conditions',
      of: [{type: 'collectionRule'}],
    }),
    defineField({
      name: 'disjunctive',
      title: 'Règles disjonctives ?',
      description:
        'Exiger une condition si vraie, sinon exiger toutes les conditions',
      type: 'boolean',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Ordre de tri',
      type: 'string',
    }),
  ],
});
