import {MENU_FRAGMENT} from '../fragments/MenuFragment';

export const FOOTER_QUERY = `#graphql
  fragment Image on Image {
    id
    url
    altText
    width
    height
  }
  query Footer(
    $country: CountryCode
    $language: LanguageCode
    $handle: MetaobjectHandleInput!
    $footerMenuHandle: String!
    $legalMenuHandle: String!
  ) @inContext(language: $language, country: $country) {
    content: metaobject(handle: $handle) {
      labelFooter: field(key: "label_footer") {
        value
      }
      youtubeUrl: field(key: "youtube_url") {
        value
      }
      facebookUrl: field(key: "facebook_url") {
        value
      }
      instagramUrl: field(key: "instagram_url") {
        value
      }
      paymentIcons: field(key: "payments_icons") {
        references(first: 10) {
          nodes {
            ... on MediaImage {
              image {
                ...Image
              }
            }
          }
        }
      }
      labelRights: field(key: "label_rights") {
        value
      }
      labelSiteBy: field(key: "label_site_by") {
        value
      }
    }
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
    legalMenu: menu(handle: $legalMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
