import {defineField, defineType} from 'sanity';

export const shopifyProductVariantType = defineType({
  name: 'shopifyProductVariant',
  title: 'Shopify',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fieldsets: [
    {
      name: 'options',
      title: 'Options',
      options: {
        columns: 3,
      },
    },
    {
      name: 'status',
      title: 'Statut',
    },
  ],
  fields: [
    defineField({
      fieldset: 'status',
      name: 'createdAt',
      type: 'string',
      title: 'Date de création',
    }),
    defineField({
      fieldset: 'status',
      name: 'updatedAt',
      type: 'string',
      title: 'Date de mise à jour',
    }),
    defineField({
      fieldset: 'status',
      name: 'status',
      type: 'string',
      title: 'Statut',
      options: {
        layout: 'dropdown',
        list: ['archived', 'draft', 'active'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      fieldset: 'status',
      name: 'isDeleted',
      title: 'Supprimé de Shopify ?',
      type: 'boolean',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titre',
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'ID de la variante du produit Shopify',
    }),
    defineField({
      name: 'gid',
      title: 'GID',
      type: 'string',
      description: 'GID de la variante du produit Shopify',
    }),
    defineField({
      name: 'productId',
      title: 'ID du produit',
      type: 'number',
    }),
    defineField({
      name: 'productGid',
      title: 'GID du produit',
      type: 'string',
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Prix',
    }),
    defineField({
      name: 'compareAtPrice',
      type: 'number',
      title: 'Prix de comparaison',
    }),
    defineField({
      name: 'inventory',
      type: 'inventory',
      options: {
        columns: 3,
      },
      title: 'Inventaire',
    }),
    defineField({
      fieldset: 'options',
      name: 'option1',
      type: 'string',
      title: 'Option 1',
    }),
    defineField({
      fieldset: 'options',
      name: 'option2',
      type: 'string',
      title: 'Option 2',
    }),
    defineField({
      fieldset: 'options',
      name: 'option3',
      type: 'string',
      title: 'Option 3',
    }),
    // URL de l'image de prévisualisation
    defineField({
      name: 'previewImageUrl',
      title: 'URL de l’image de prévisualisation',
      type: 'string',
      description: 'Image affichée dans le panier et à la caisse',
    }),
  ],
  readOnly: true,
});
