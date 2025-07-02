import {MENU_FRAGMENT} from '../fragments/MenuFragment';
import {COLLECTION_ITEM_FRAGMENT} from '../fragments/CollectionItemFragment';

export const HEADER_QUERY = `#graphql
  fragment LauncherItem on Metaobject {
    id
    type
    handle
    collection: field(key: "collection") {
      reference {
        ... CollectionItem
      }
    }
    product: field(key: "product") {
      reference {
        ...ProductItem
      }
    }
  }
  fragment CollectionMenu on Collection {
      id
      handle
      title
      highlightCollection: metafield(namespace: "custom", key: "highlight_collection") {
        value
      }
      relatedCollections: metafield(namespace: "custom", key: "related_collections") {
        references(first: 20) {
          nodes {
            ... CollectionItem
          }
        }
      }
      concernsCollections: metafield(namespace: "custom", key: "concerns") {
        references(first: 20) {
          nodes {
            ... CollectionItem
          }
        }
      }
      highlightItems: metafield(namespace: "custom", key: "highlight_items"){
        references(first: 2) {
          nodes {
            ... LauncherItem
          }
        }
      }
  }
  query Header(
    $language: LanguageCode
    $country: CountryCode
    $mainMenuHandle: String!
    $secondaryMenuHandle: String!
    $secondaryMenuMobileHandle: String!
    $menuHandle: MetaobjectHandleInput!
    $first: Int,
    $priceMin: Float = 0.1
  ) @inContext(language: $language, country: $country) {
    mainMenu : menu(handle: $mainMenuHandle) {
      ...Menu
    }
    secondaryMenu: menu(handle: $secondaryMenuHandle) {
      ...Menu
    }
    secondaryMenuMobile: menu(handle: $secondaryMenuMobileHandle) {
      ...Menu
    }
    menu: metaobject(handle: $menuHandle) {
      title: field(key: "title") {
        value
      }
      labelCategories: field(key: "label_categories") {
        value
      }
      categories: field(key: "categories") {
        references(first: 10) {
          nodes {
            ... CollectionMenu
          }
        }
      }
      labelSeeAll: field(key: "label_see_all") {
        value
      }
      labelConcerns: field(key: "label_concerns") {
        value
      }
      labelLaunchers: field(key: "label_launchers") {
        value
      }
      collectionsHighlight: field(key: "collections_highlight") {
        references(first: 2) {
          nodes {
            ... CollectionItem
          }
        }
      }
    }
  }
  ${MENU_FRAGMENT}
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
