import {
  DocumentsIcon,
  FilterIcon,
  HomeIcon,
  BlockElementIcon,
} from '@sanity/icons';
import type {ListItemBuilder} from 'sanity/structure';
import {SANITY_API_VERSION} from '../constants';
import defineStructure from '../utils/defineStructure';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Conseils et astuces')
    .schemaType('blog')
    .child(
      S.list()
        .title('Conseils et astuces')
        .items([
          S.listItem()
            .title('Accueil')
            .schemaType('blog')
            .icon(HomeIcon)
            .child(
              S.document()
                .schemaType('blog')
                .documentId('blog')
                .views([S.view.form()]),
            ),
          S.listItem()
            .title('Catégories')
            .schemaType('articleCategory')
            .icon(FilterIcon)
            .child(
              S.documentList()
                .id('articleCategories')
                .title('Catégories')
                .schemaType('articleCategory')
                .filter('_type == "articleCategory"')
                .apiVersion(SANITY_API_VERSION)
                .canHandleIntent(
                  (intentName, params) =>
                    intentName === 'edit' && params.type === 'articleCategory',
                ),
            ),
          S.listItem()
            .title('Articles')
            .schemaType('article')
            .icon(DocumentsIcon)
            .child(
              S.documentList()
                .id('articles')
                .title('Articles')
                .schemaType('article')
                .filter('_type == "article"')
                .apiVersion(SANITY_API_VERSION)
                .canHandleIntent(
                  (intentName, params) =>
                    intentName === 'edit' && params.type === 'article',
                ),
            ),
          S.listItem()
            .title('Lanceur articles')
            .schemaType('articleLauncher')
            .icon(BlockElementIcon)
            .child(
              S.document()
                .schemaType('articleLauncher')
                .documentId('articleLauncher')
                .views([S.view.form()]),
            ),
        ]),
    ),
);
