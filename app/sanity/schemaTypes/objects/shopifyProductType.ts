import {defineArrayMember, defineField, defineType} from 'sanity';

export const shopifyProductType = defineType({
  name: 'shopifyProduct',
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
    {
      name: 'organization',
      title: 'Organisation',
      options: {
        columns: 2,
      },
    },
    {
      name: 'variants',
      title: 'Variantes',
      options: {
        collapsed: true,
        collapsible: true,
      },
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
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        layout: 'dropdown',
        list: ['actif', 'archivé', 'brouillon'],
      },
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
      description: 'Titre affiché dans le panier et à la caisse',
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'ID du produit Shopify',
    }),
    defineField({
      name: 'gid',
      title: 'GID',
      type: 'string',
      description: 'GID du produit Shopify',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Handle du produit Shopify',
    }),
    defineField({
      name: 'descriptionHtml',
      title: 'Description HTML',
      type: 'text',
      rows: 5,
    }),
    defineField({
      fieldset: 'organization',
      name: 'productType',
      title: 'Type de produit',
      type: 'string',
    }),
    defineField({
      fieldset: 'organization',
      name: 'vendor',
      title: 'Vendeur',
      type: 'string',
    }),
    defineField({
      fieldset: 'organization',
      name: 'tags',
      title: 'Tags',
      type: 'string',
    }),
    defineField({
      name: 'priceRange',
      title: 'Fourchette de prix',
      type: 'priceRange',
    }),
    defineField({
      name: 'previewImageUrl',
      title: 'URL de l’image de prévisualisation',
      type: 'string',
      description: 'Image affichée dans le panier et à la caisse',
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{type: 'option'}],
    }),
    defineField({
      fieldset: 'variants',
      name: 'variants',
      title: 'Variantes',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Variante',
          type: 'reference',
          weak: true,
          to: [{type: 'productVariant'}],
        }),
      ],
    }),
  ],
});
