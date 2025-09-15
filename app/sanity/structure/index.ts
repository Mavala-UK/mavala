import {SITES} from '../constants';
import type {ListItemBuilder, StructureResolver} from 'sanity/structure';
import collections from './collectionStructure';
import home from './homeStructure';
import blog from './blogStructure';
import pages from './pageStructure';
import products from './productStructure';
import translations from './translationsStructure';

/**
 * Structure overrides
 *
 * Sanity Studio automatically lists document types out of the box.
 * With this custom structure we achieve things like showing the `home`
 * and `settings` document types as singletons, and grouping product details
 * and variants for easy editorial access.
 *
 * You can customize this even further as your schema types progress.
 * To learn more about structure builder, visit our docs:
 * https://www.sanity.io/docs/overview-structure-builder
 */

// If you add document types to structure manually, you can add them to this function to prevent duplicates in the root pane
const hiddenDocTypes = (listItem: ListItemBuilder) => {
  const id = listItem.getId();

  if (!id) {
    return false;
  }

  return ![
    'article',
    'articleCategory',
    'articleLauncher',
    'collection',
    'home',
    'blog',
    'media.tag',
    'page',
    'product',
    'productVariant',
    'translation',
  ].includes(id);
};

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      home(S, context),
      pages(S, context),
      ...(SITES?.isMavalaFrance ? [blog(S, context)] : []),
      S.divider(),
      collections(S, context),
      products(S, context),
      S.divider(),
      translations(S, context),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
