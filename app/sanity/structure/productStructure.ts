import {InfoOutlineIcon} from '@sanity/icons';
import type {ListItemBuilder} from 'sanity/structure';
import defineStructure from '../utils/defineStructure';
import {SANITY_API_VERSION} from '../constants';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Produits')
    .schemaType('product')
    .child(
      S.documentTypeList('product').child(async (id) =>
        S.list()
          .title('Produit')
          .canHandleIntent(
            (intentName, params) =>
              intentName === 'edit' && params.type === 'product',
          )
          .items([
            // Details
            S.listItem()
              .title('Détails')
              .icon(InfoOutlineIcon)
              .schemaType('product')
              .id(id)
              .child(S.document().schemaType('product').documentId(id)),
            // Product variants
            S.listItem()
              .title('Variantes')
              .schemaType('productVariant')
              .child(
                S.documentList()
                  .title('Variantes')
                  .apiVersion(SANITY_API_VERSION)
                  .schemaType('productVariant')
                  .filter(
                    `
                      _type == "productVariant"
                      && store.productId == $productId
                    `,
                  )
                  .params({
                    productId: Number(id.replace('shopifyProduct-', '')),
                  })
                  .canHandleIntent(
                    (intentName, params) =>
                      intentName === 'edit' && params.type === 'productVariant',
                  ),
              ),
          ]),
      ),
    ),
);
