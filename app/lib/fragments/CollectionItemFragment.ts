import {PRODUCT_ITEM_FRAGMENT} from './ProductItemFragment';

export const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment ImageCollectionItem on Image {
    id
    url
    altText
    width
    height
  }
  fragment VideoSource on VideoSource {
    url
    mimeType
    width
    format
    height
  }
  fragment CollectionItem on Collection {
    id
    handle
    title
    image {
      ...ImageCollectionItem
    }
    posterVideo: metafield(namespace: "custom", key: "poster_video") {
      reference{
        ... on Video {
          alt
          previewImage{
            ...ImageCollectionItem
          }
          sources {
            ...VideoSource
          }
        }
      }
    }
    products(first: $first, filters: {price: {min: $priceMin}}) {
      nodes {
        ...ProductItem
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
