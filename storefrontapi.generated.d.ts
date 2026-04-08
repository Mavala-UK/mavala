/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'quantityAvailable' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<
      StorefrontAPI.Product,
      'id' | 'handle' | 'title' | 'productType' | 'vendor'
    > & {
      collections: {
        nodes: Array<Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'>>;
      };
    };
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountAllocations: Array<
    Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
      discountedAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity'
> & {
  lines: {
    nodes: Array<
      Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
        cost: {
          totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          subtotalAmount: Pick<
            StorefrontAPI.MoneyV2,
            'currencyCode' | 'amount'
          >;
        };
        merchandise: Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'quantityAvailable' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          product: Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'productType' | 'vendor'
          > & {
            collections: {
              nodes: Array<
                Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'>
              >;
            };
          };
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
        };
        attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
        discountAllocations: Array<
          Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
            discountedAmount: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
          }
        >;
      }
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
  };
};

export type ImageCollectionItemFragment = Pick<
  StorefrontAPI.Image,
  'id' | 'url' | 'altText' | 'width' | 'height'
>;

export type VideoSourceFragment = Pick<
  StorefrontAPI.VideoSource,
  'url' | 'mimeType' | 'width' | 'format' | 'height'
>;

export type CollectionItemFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'handle' | 'title'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  posterVideo?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Video, 'alt'> & {
        previewImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        sources: Array<
          Pick<
            StorefrontAPI.VideoSource,
            'url' | 'mimeType' | 'width' | 'format' | 'height'
          >
        >;
      }
    >;
  }>;
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'productType'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              tint?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  color?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }>;
              }>;
            }
          >;
        };
        defaultVariant?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'>
          >;
        }>;
        capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        badges?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }>;
      }
    >;
  };
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type SubMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type ImageProductFragment = Pick<
  StorefrontAPI.Image,
  'id' | 'url' | 'altText' | 'width' | 'height'
>;

export type VideoFragment = Pick<StorefrontAPI.Video, 'alt'> & {
  previewImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  sources: Array<
    Pick<
      StorefrontAPI.VideoSource,
      'url' | 'mimeType' | 'width' | 'format' | 'height'
    >
  >;
};

export type MainColorFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle'
> & {
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<
          StorefrontAPI.Product,
          'title' | 'productType' | 'handle'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        tint?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            name?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            color?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            image?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            }>;
          }>;
        }>;
        textureImg?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            }
          >;
        }>;
        galleryMedias?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  sources: Array<
                    Pick<
                      StorefrontAPI.VideoSource,
                      'url' | 'mimeType' | 'width' | 'format' | 'height'
                    >
                  >;
                })
            >;
          }>;
        }>;
        badges?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }>;
        finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        protector?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        hideFromBundle?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
        accordion?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              title?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }
    >;
  };
  mainColor?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        name?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        code?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
      }
    >;
  }>;
  defaultVariant?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<
          StorefrontAPI.Product,
          'title' | 'productType' | 'handle'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        tint?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            name?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            color?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            image?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            }>;
          }>;
        }>;
        textureImg?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            }
          >;
        }>;
        galleryMedias?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  sources: Array<
                    Pick<
                      StorefrontAPI.VideoSource,
                      'url' | 'mimeType' | 'width' | 'format' | 'height'
                    >
                  >;
                })
            >;
          }>;
        }>;
        badges?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }>;
        finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        protector?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        hideFromBundle?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
        accordion?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              title?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }
    >;
  }>;
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'productType' | 'vendor' | 'handle' | 'description'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  media: {
    nodes: Array<
      | Pick<StorefrontAPI.ExternalVideo, 'id' | 'mediaContentType'>
      | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
      | Pick<StorefrontAPI.Model3d, 'id' | 'mediaContentType'>
      | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType' | 'alt'> & {
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          sources: Array<
            Pick<
              StorefrontAPI.VideoSource,
              'url' | 'mimeType' | 'width' | 'format' | 'height'
            >
          >;
        })
    >;
  };
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<
          StorefrontAPI.Product,
          'title' | 'productType' | 'handle'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        tint?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            name?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            color?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            image?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            }>;
          }>;
        }>;
        textureImg?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            }
          >;
        }>;
        galleryMedias?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  sources: Array<
                    Pick<
                      StorefrontAPI.VideoSource,
                      'url' | 'mimeType' | 'width' | 'format' | 'height'
                    >
                  >;
                })
            >;
          }>;
        }>;
        badges?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }>;
        finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        protector?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        hideFromBundle?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
        accordion?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              title?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }
    >;
  };
  selectedVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'productType' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      tint?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<{
          name?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
          color?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
          image?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          }>;
        }>;
      }>;
      textureImg?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          }
        >;
      }>;
      galleryMedias?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'url' | 'mimeType' | 'width' | 'format' | 'height'
                  >
                >;
              })
          >;
        }>;
      }>;
      badges?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      protector?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      hideFromBundle?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      accordion?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metaobject, 'id'> & {
            title?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            text?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
          }
        >;
      }>;
    }
  >;
  canonicalCollection?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Collection, 'handle' | 'title'> & {
        parentCollection?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Collection, 'handle' | 'title'> & {
              parentCollection?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Collection, 'handle' | 'title'>
                >;
              }>;
            }
          >;
        }>;
      }
    >;
  }>;
  canonicalProduct?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Product, 'handle' | 'title'>
    >;
  }>;
  defaultVariant?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<
          StorefrontAPI.Product,
          'title' | 'productType' | 'handle'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        tint?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            name?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            color?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            image?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            }>;
          }>;
        }>;
        textureImg?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            }
          >;
        }>;
        galleryMedias?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  sources: Array<
                    Pick<
                      StorefrontAPI.VideoSource,
                      'url' | 'mimeType' | 'width' | 'format' | 'height'
                    >
                  >;
                })
            >;
          }>;
        }>;
        badges?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }>;
        finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        protector?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        hideFromBundle?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
        accordion?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              title?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }
    >;
  }>;
  badges?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          text?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
        }
      >;
    }>;
  }>;
  capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  reassurances?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          text?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
        }
      >;
    }>;
  }>;
  mainColor?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        name?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        code?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
      }
    >;
  }>;
  associatedProducts?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
          variants: {
            nodes: Array<
              Pick<
                StorefrontAPI.ProductVariant,
                'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                product: Pick<
                  StorefrontAPI.Product,
                  'title' | 'productType' | 'handle'
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                unitPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                tint?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<{
                    name?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    color?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    image?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        }
                      >;
                    }>;
                  }>;
                }>;
                textureImg?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    }
                  >;
                }>;
                galleryMedias?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      | (Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Video,
                          'alt' | 'mediaContentType'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          sources: Array<
                            Pick<
                              StorefrontAPI.VideoSource,
                              'url' | 'mimeType' | 'width' | 'format' | 'height'
                            >
                          >;
                        })
                    >;
                  }>;
                }>;
                badges?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                        text?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }
                    >;
                  }>;
                }>;
                finish?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                protector?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                hideFromBundle?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                accordion?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      title?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                      text?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }
                  >;
                }>;
              }
            >;
          };
          mainColor?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                name?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                code?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
          defaultVariant?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.ProductVariant,
                'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                product: Pick<
                  StorefrontAPI.Product,
                  'title' | 'productType' | 'handle'
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                unitPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                tint?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<{
                    name?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    color?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    image?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        }
                      >;
                    }>;
                  }>;
                }>;
                textureImg?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    }
                  >;
                }>;
                galleryMedias?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      | (Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Video,
                          'alt' | 'mediaContentType'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          sources: Array<
                            Pick<
                              StorefrontAPI.VideoSource,
                              'url' | 'mimeType' | 'width' | 'format' | 'height'
                            >
                          >;
                        })
                    >;
                  }>;
                }>;
                badges?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                        text?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }
                    >;
                  }>;
                }>;
                finish?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                protector?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                hideFromBundle?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                accordion?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      title?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                      text?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }
                  >;
                }>;
              }
            >;
          }>;
        }
      >;
    }>;
  }>;
  favoriteShades?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<
            StorefrontAPI.Product,
            'title' | 'productType' | 'handle'
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          tint?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<{
              name?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              color?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              image?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  }
                >;
              }>;
            }>;
          }>;
          textureImg?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          }>;
          galleryMedias?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'mimeType' | 'width' | 'format' | 'height'
                      >
                    >;
                  })
              >;
            }>;
          }>;
          badges?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  text?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }>;
          finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          protector?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          hideFromBundle?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          accordion?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                title?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }
      >;
    }>;
  }>;
  complementaryProducts?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'value'> & {
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'vendor' | 'productType'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  tint?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<{
                      color?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }>;
                  }>;
                }
              >;
            };
            defaultVariant?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductVariant, 'id'>
              >;
            }>;
            capacity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
          }
        >;
      }>;
    }
  >;
  accordions?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          title?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
          text?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
        }
      >;
    }>;
  }>;
  featuresTitle?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  features?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          icon?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            }>;
          }>;
          text?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
        }
      >;
    }>;
  }>;
  bundleComponents?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'handle' | 'title' | 'vendor' | 'productType'
        > & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          variants: {
            nodes: Array<
              Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'title' | 'availableForSale'
              > & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                tint?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<{
                    color?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }>;
                }>;
              }
            >;
          };
          defaultVariant?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ProductVariant, 'id'>
            >;
          }>;
          capacity?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          badges?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  text?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }>;
        }
      >;
    }>;
  }>;
  videoSection?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
        title?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        text?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        file?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Video, 'alt'> & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              sources: Array<
                Pick<
                  StorefrontAPI.VideoSource,
                  'url' | 'mimeType' | 'width' | 'format' | 'height'
                >
              >;
            }
          >;
        }>;
      }
    >;
  }>;
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type ImageFragment = Pick<
  StorefrontAPI.Image,
  'id' | 'url' | 'altText' | 'width' | 'height'
>;

export type ProductVariantItemFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'title' | 'availableForSale'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  tint?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      color?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
    }>;
  }>;
};

export type ProductItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'vendor' | 'productType'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'title' | 'availableForSale'
      > & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        tint?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            color?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
          }>;
        }>;
      }
    >;
  };
  defaultVariant?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ProductVariant, 'id'>>;
  }>;
  capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  badges?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          text?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
        }
      >;
    }>;
  }>;
};

export type ImageProductVariantFragment = Pick<
  StorefrontAPI.Image,
  'id' | 'url' | 'altText' | 'width' | 'height'
>;

export type VideoSourceVariantFragment = Pick<
  StorefrontAPI.VideoSource,
  'url' | 'mimeType' | 'width' | 'format' | 'height'
>;

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'title' | 'productType' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  tint?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      name?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
      color?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
      image?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          }
        >;
      }>;
    }>;
  }>;
  textureImg?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  }>;
  galleryMedias?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          })
        | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
            previewImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            sources: Array<
              Pick<
                StorefrontAPI.VideoSource,
                'url' | 'mimeType' | 'width' | 'format' | 'height'
              >
            >;
          })
      >;
    }>;
  }>;
  badges?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          text?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MetaobjectField, 'value'>
          >;
        }
      >;
    }>;
  }>;
  finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  protector?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  hideFromBundle?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  accordion?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        title?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        text?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
      }
    >;
  }>;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.MetaobjectHandleInput;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  legalMenuHandle: StorefrontAPI.Scalars['String']['input'];
}>;

export type FooterQuery = {
  content?: StorefrontAPI.Maybe<{
    labelFooter?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    youtubeUrl?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    facebookUrl?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    instagramUrl?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    paymentIcons?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<{
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        }>;
      }>;
    }>;
    labelRights?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    labelSiteBy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
  }>;
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  legalMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type LauncherItemFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'type' | 'handle'
> & {
  collection?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        posterVideo?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Video, 'alt'> & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              sources: Array<
                Pick<
                  StorefrontAPI.VideoSource,
                  'url' | 'mimeType' | 'width' | 'format' | 'height'
                >
              >;
            }
          >;
        }>;
        products: {
          nodes: Array<
            Pick<
              StorefrontAPI.Product,
              'id' | 'handle' | 'title' | 'vendor' | 'productType'
            > & {
              featuredImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              variants: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.ProductVariant,
                    'id' | 'title' | 'availableForSale'
                  > & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    tint?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<{
                        color?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }>;
                    }>;
                  }
                >;
              };
              defaultVariant?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.ProductVariant, 'id'>
                >;
              }>;
              capacity?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              badges?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      text?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }
                  >;
                }>;
              }>;
            }
          >;
        };
      }
    >;
  }>;
  product?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'productType'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              tint?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  color?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }>;
              }>;
            }
          >;
        };
        defaultVariant?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'>
          >;
        }>;
        capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        badges?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }>;
      }
    >;
  }>;
};

export type CollectionMenuFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'handle' | 'title'
> & {
  highlightCollection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'value'>
  >;
  relatedCollections?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          posterVideo?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Video, 'alt'> & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'url' | 'mimeType' | 'width' | 'format' | 'height'
                  >
                >;
              }
            >;
          }>;
          products: {
            nodes: Array<
              Pick<
                StorefrontAPI.Product,
                'id' | 'handle' | 'title' | 'vendor' | 'productType'
              > & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                variants: {
                  nodes: Array<
                    Pick<
                      StorefrontAPI.ProductVariant,
                      'id' | 'title' | 'availableForSale'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                      compareAtPrice?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                      >;
                      selectedOptions: Array<
                        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                      >;
                      tint?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<{
                          color?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }>;
                      }>;
                    }
                  >;
                };
                defaultVariant?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductVariant, 'id'>
                  >;
                }>;
                capacity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                badges?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                        text?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }
                    >;
                  }>;
                }>;
              }
            >;
          };
        }
      >;
    }>;
  }>;
  concernsCollections?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          posterVideo?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Video, 'alt'> & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'url' | 'mimeType' | 'width' | 'format' | 'height'
                  >
                >;
              }
            >;
          }>;
          products: {
            nodes: Array<
              Pick<
                StorefrontAPI.Product,
                'id' | 'handle' | 'title' | 'vendor' | 'productType'
              > & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                variants: {
                  nodes: Array<
                    Pick<
                      StorefrontAPI.ProductVariant,
                      'id' | 'title' | 'availableForSale'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                      compareAtPrice?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                      >;
                      selectedOptions: Array<
                        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                      >;
                      tint?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<{
                          color?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }>;
                      }>;
                    }
                  >;
                };
                defaultVariant?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductVariant, 'id'>
                  >;
                }>;
                capacity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                badges?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                        text?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }
                    >;
                  }>;
                }>;
              }
            >;
          };
        }
      >;
    }>;
  }>;
  highlightItems?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'type' | 'handle'> & {
          collection?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                posterVideo?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Video, 'alt'> & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      sources: Array<
                        Pick<
                          StorefrontAPI.VideoSource,
                          'url' | 'mimeType' | 'width' | 'format' | 'height'
                        >
                      >;
                    }
                  >;
                }>;
                products: {
                  nodes: Array<
                    Pick<
                      StorefrontAPI.Product,
                      'id' | 'handle' | 'title' | 'vendor' | 'productType'
                    > & {
                      featuredImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      variants: {
                        nodes: Array<
                          Pick<
                            StorefrontAPI.ProductVariant,
                            'id' | 'title' | 'availableForSale'
                          > & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'id' | 'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                            price: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                            compareAtPrice?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >
                            >;
                            selectedOptions: Array<
                              Pick<
                                StorefrontAPI.SelectedOption,
                                'name' | 'value'
                              >
                            >;
                            tint?: StorefrontAPI.Maybe<{
                              reference?: StorefrontAPI.Maybe<{
                                color?: StorefrontAPI.Maybe<
                                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                                >;
                              }>;
                            }>;
                          }
                        >;
                      };
                      defaultVariant?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.ProductVariant, 'id'>
                        >;
                      }>;
                      capacity?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Metafield, 'value'>
                      >;
                      badges?: StorefrontAPI.Maybe<{
                        references?: StorefrontAPI.Maybe<{
                          nodes: Array<
                            Pick<StorefrontAPI.Metaobject, 'id'> & {
                              text?: StorefrontAPI.Maybe<
                                Pick<StorefrontAPI.MetaobjectField, 'value'>
                              >;
                            }
                          >;
                        }>;
                      }>;
                    }
                  >;
                };
              }
            >;
          }>;
          product?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Product,
                'id' | 'handle' | 'title' | 'vendor' | 'productType'
              > & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                variants: {
                  nodes: Array<
                    Pick<
                      StorefrontAPI.ProductVariant,
                      'id' | 'title' | 'availableForSale'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                      compareAtPrice?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                      >;
                      selectedOptions: Array<
                        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                      >;
                      tint?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<{
                          color?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }>;
                      }>;
                    }
                  >;
                };
                defaultVariant?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductVariant, 'id'>
                  >;
                }>;
                capacity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                badges?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                        text?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }
                    >;
                  }>;
                }>;
              }
            >;
          }>;
        }
      >;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  mainMenuHandle: StorefrontAPI.Scalars['String']['input'];
  secondaryMenuHandle: StorefrontAPI.Scalars['String']['input'];
  secondaryMenuMobileHandle: StorefrontAPI.Scalars['String']['input'];
  menuHandle: StorefrontAPI.MetaobjectHandleInput;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  priceMin?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Float']['input']>;
}>;

export type HeaderQuery = {
  mainMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  secondaryMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  secondaryMenuMobile?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  menu?: StorefrontAPI.Maybe<{
    title?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
    labelCategories?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    categories?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
            highlightCollection?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            relatedCollections?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    posterVideo?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Video, 'alt'> & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          sources: Array<
                            Pick<
                              StorefrontAPI.VideoSource,
                              'url' | 'mimeType' | 'width' | 'format' | 'height'
                            >
                          >;
                        }
                      >;
                    }>;
                    products: {
                      nodes: Array<
                        Pick<
                          StorefrontAPI.Product,
                          'id' | 'handle' | 'title' | 'vendor' | 'productType'
                        > & {
                          featuredImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          variants: {
                            nodes: Array<
                              Pick<
                                StorefrontAPI.ProductVariant,
                                'id' | 'title' | 'availableForSale'
                              > & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    | 'id'
                                    | 'url'
                                    | 'altText'
                                    | 'width'
                                    | 'height'
                                  >
                                >;
                                price: Pick<
                                  StorefrontAPI.MoneyV2,
                                  'amount' | 'currencyCode'
                                >;
                                compareAtPrice?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >
                                >;
                                selectedOptions: Array<
                                  Pick<
                                    StorefrontAPI.SelectedOption,
                                    'name' | 'value'
                                  >
                                >;
                                tint?: StorefrontAPI.Maybe<{
                                  reference?: StorefrontAPI.Maybe<{
                                    color?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'value'
                                      >
                                    >;
                                  }>;
                                }>;
                              }
                            >;
                          };
                          defaultVariant?: StorefrontAPI.Maybe<{
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.ProductVariant, 'id'>
                            >;
                          }>;
                          capacity?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Metafield, 'value'>
                          >;
                          badges?: StorefrontAPI.Maybe<{
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                Pick<StorefrontAPI.Metaobject, 'id'> & {
                                  text?: StorefrontAPI.Maybe<
                                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                                  >;
                                }
                              >;
                            }>;
                          }>;
                        }
                      >;
                    };
                  }
                >;
              }>;
            }>;
            concernsCollections?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    posterVideo?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Video, 'alt'> & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          sources: Array<
                            Pick<
                              StorefrontAPI.VideoSource,
                              'url' | 'mimeType' | 'width' | 'format' | 'height'
                            >
                          >;
                        }
                      >;
                    }>;
                    products: {
                      nodes: Array<
                        Pick<
                          StorefrontAPI.Product,
                          'id' | 'handle' | 'title' | 'vendor' | 'productType'
                        > & {
                          featuredImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          variants: {
                            nodes: Array<
                              Pick<
                                StorefrontAPI.ProductVariant,
                                'id' | 'title' | 'availableForSale'
                              > & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    | 'id'
                                    | 'url'
                                    | 'altText'
                                    | 'width'
                                    | 'height'
                                  >
                                >;
                                price: Pick<
                                  StorefrontAPI.MoneyV2,
                                  'amount' | 'currencyCode'
                                >;
                                compareAtPrice?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >
                                >;
                                selectedOptions: Array<
                                  Pick<
                                    StorefrontAPI.SelectedOption,
                                    'name' | 'value'
                                  >
                                >;
                                tint?: StorefrontAPI.Maybe<{
                                  reference?: StorefrontAPI.Maybe<{
                                    color?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'value'
                                      >
                                    >;
                                  }>;
                                }>;
                              }
                            >;
                          };
                          defaultVariant?: StorefrontAPI.Maybe<{
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.ProductVariant, 'id'>
                            >;
                          }>;
                          capacity?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Metafield, 'value'>
                          >;
                          badges?: StorefrontAPI.Maybe<{
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                Pick<StorefrontAPI.Metaobject, 'id'> & {
                                  text?: StorefrontAPI.Maybe<
                                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                                  >;
                                }
                              >;
                            }>;
                          }>;
                        }
                      >;
                    };
                  }
                >;
              }>;
            }>;
            highlightItems?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id' | 'type' | 'handle'> & {
                    collection?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          posterVideo?: StorefrontAPI.Maybe<{
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.Video, 'alt'> & {
                                previewImage?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    | 'id'
                                    | 'url'
                                    | 'altText'
                                    | 'width'
                                    | 'height'
                                  >
                                >;
                                sources: Array<
                                  Pick<
                                    StorefrontAPI.VideoSource,
                                    | 'url'
                                    | 'mimeType'
                                    | 'width'
                                    | 'format'
                                    | 'height'
                                  >
                                >;
                              }
                            >;
                          }>;
                          products: {
                            nodes: Array<
                              Pick<
                                StorefrontAPI.Product,
                                | 'id'
                                | 'handle'
                                | 'title'
                                | 'vendor'
                                | 'productType'
                              > & {
                                featuredImage?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    | 'id'
                                    | 'url'
                                    | 'altText'
                                    | 'width'
                                    | 'height'
                                  >
                                >;
                                variants: {
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.ProductVariant,
                                      'id' | 'title' | 'availableForSale'
                                    > & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          | 'id'
                                          | 'url'
                                          | 'altText'
                                          | 'width'
                                          | 'height'
                                        >
                                      >;
                                      price: Pick<
                                        StorefrontAPI.MoneyV2,
                                        'amount' | 'currencyCode'
                                      >;
                                      compareAtPrice?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.MoneyV2,
                                          'amount' | 'currencyCode'
                                        >
                                      >;
                                      selectedOptions: Array<
                                        Pick<
                                          StorefrontAPI.SelectedOption,
                                          'name' | 'value'
                                        >
                                      >;
                                      tint?: StorefrontAPI.Maybe<{
                                        reference?: StorefrontAPI.Maybe<{
                                          color?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MetaobjectField,
                                              'value'
                                            >
                                          >;
                                        }>;
                                      }>;
                                    }
                                  >;
                                };
                                defaultVariant?: StorefrontAPI.Maybe<{
                                  reference?: StorefrontAPI.Maybe<
                                    Pick<StorefrontAPI.ProductVariant, 'id'>
                                  >;
                                }>;
                                capacity?: StorefrontAPI.Maybe<
                                  Pick<StorefrontAPI.Metafield, 'value'>
                                >;
                                badges?: StorefrontAPI.Maybe<{
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                                        text?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'value'
                                          >
                                        >;
                                      }
                                    >;
                                  }>;
                                }>;
                              }
                            >;
                          };
                        }
                      >;
                    }>;
                    product?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Product,
                          'id' | 'handle' | 'title' | 'vendor' | 'productType'
                        > & {
                          featuredImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                          variants: {
                            nodes: Array<
                              Pick<
                                StorefrontAPI.ProductVariant,
                                'id' | 'title' | 'availableForSale'
                              > & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    | 'id'
                                    | 'url'
                                    | 'altText'
                                    | 'width'
                                    | 'height'
                                  >
                                >;
                                price: Pick<
                                  StorefrontAPI.MoneyV2,
                                  'amount' | 'currencyCode'
                                >;
                                compareAtPrice?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >
                                >;
                                selectedOptions: Array<
                                  Pick<
                                    StorefrontAPI.SelectedOption,
                                    'name' | 'value'
                                  >
                                >;
                                tint?: StorefrontAPI.Maybe<{
                                  reference?: StorefrontAPI.Maybe<{
                                    color?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'value'
                                      >
                                    >;
                                  }>;
                                }>;
                              }
                            >;
                          };
                          defaultVariant?: StorefrontAPI.Maybe<{
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.ProductVariant, 'id'>
                            >;
                          }>;
                          capacity?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Metafield, 'value'>
                          >;
                          badges?: StorefrontAPI.Maybe<{
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                Pick<StorefrontAPI.Metaobject, 'id'> & {
                                  text?: StorefrontAPI.Maybe<
                                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                                  >;
                                }
                              >;
                            }>;
                          }>;
                        }
                      >;
                    }>;
                  }
                >;
              }>;
            }>;
          }
        >;
      }>;
    }>;
    labelSeeAll?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    labelConcerns?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    labelLaunchers?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    collectionsHighlight?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            posterVideo?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Video, 'alt'> & {
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  sources: Array<
                    Pick<
                      StorefrontAPI.VideoSource,
                      'url' | 'mimeType' | 'width' | 'format' | 'height'
                    >
                  >;
                }
              >;
            }>;
            products: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Product,
                  'id' | 'handle' | 'title' | 'vendor' | 'productType'
                > & {
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  variants: {
                    nodes: Array<
                      Pick<
                        StorefrontAPI.ProductVariant,
                        'id' | 'title' | 'availableForSale'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'id' | 'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        compareAtPrice?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                        >;
                        selectedOptions: Array<
                          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                        >;
                        tint?: StorefrontAPI.Maybe<{
                          reference?: StorefrontAPI.Maybe<{
                            color?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MetaobjectField, 'value'>
                            >;
                          }>;
                        }>;
                      }
                    >;
                  };
                  defaultVariant?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.ProductVariant, 'id'>
                    >;
                  }>;
                  capacity?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metafield, 'value'>
                  >;
                  badges?: StorefrontAPI.Maybe<{
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        Pick<StorefrontAPI.Metaobject, 'id'> & {
                          text?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }
                      >;
                    }>;
                  }>;
                }
              >;
            };
          }
        >;
      }>;
    }>;
  }>;
};

export type ShopQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
}>;

export type ShopQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Brand, 'shortDescription'> & {
        logo?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        }>;
        coverImage?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        }>;
      }
    >;
    paymentSettings: Pick<StorefrontAPI.PaymentSettings, 'currencyCode'>;
  };
};

export type GlobalQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.MetaobjectHandleInput;
}>;

export type GlobalQuery = {
  global?: StorefrontAPI.Maybe<{
    announcements?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Metaobject, 'id'> & {
            title?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            link?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
          }
        >;
      }>;
    }>;
    ctas?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Metaobject, 'id'> & {
            picto?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<{
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }>;
            }>;
            title?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            text?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            link?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<{
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                url?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }>;
            }>;
          }
        >;
      }>;
    }>;
    reassurances?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Metaobject, 'id'> & {
            title?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            text?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
          }
        >;
      }>;
    }>;
    newsletter?: StorefrontAPI.Maybe<{
      reference?: StorefrontAPI.Maybe<{
        title?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        subtitle?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
      }>;
    }>;
    relatedProductsEmptyCard?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'vendor' | 'productType'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  tint?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<{
                      color?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }>;
                  }>;
                }
              >;
            };
            defaultVariant?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductVariant, 'id'>
              >;
            }>;
            capacity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
          }
        >;
      }>;
    }>;
    relatedProductsAccount?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'vendor' | 'productType'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  tint?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<{
                      color?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }>;
                  }>;
                }
              >;
            };
            defaultVariant?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductVariant, 'id'>
              >;
            }>;
            capacity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
          }
        >;
      }>;
    }>;
  }>;
};

export type CollectionItemResourceQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  priceMin?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Float']['input']>;
}>;

export type CollectionItemResourceQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      posterVideo?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Video, 'alt'> & {
            previewImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            sources: Array<
              Pick<
                StorefrontAPI.VideoSource,
                'url' | 'mimeType' | 'width' | 'format' | 'height'
              >
            >;
          }
        >;
      }>;
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'vendor' | 'productType'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  tint?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<{
                      color?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }>;
                  }>;
                }
              >;
            };
            defaultVariant?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductVariant, 'id'>
              >;
            }>;
            capacity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
          }
        >;
      };
    }
  >;
};

export type ProductItemResourceQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductItemResourceQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'handle' | 'title' | 'vendor' | 'productType'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'title' | 'availableForSale'
          > & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            tint?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<{
                color?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }>;
            }>;
          }
        >;
      };
      defaultVariant?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.ProductVariant, 'id'>
        >;
      }>;
      capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      badges?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
    }
  >;
};

export type ProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  productHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
}>;

export type ProductRecommendationsQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'productType'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              tint?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  color?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }>;
              }>;
            }
          >;
        };
        defaultVariant?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'>
          >;
        }>;
        capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        badges?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }>;
      }
    >
  >;
};

export type ProductResourceQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductResourceQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'productType' | 'vendor' | 'handle' | 'description'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      media: {
        nodes: Array<
          | Pick<StorefrontAPI.ExternalVideo, 'id' | 'mediaContentType'>
          | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
          | Pick<StorefrontAPI.Model3d, 'id' | 'mediaContentType'>
          | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType' | 'alt'> & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              sources: Array<
                Pick<
                  StorefrontAPI.VideoSource,
                  'url' | 'mimeType' | 'width' | 'format' | 'height'
                >
              >;
            })
        >;
      };
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<
              StorefrontAPI.Product,
              'title' | 'productType' | 'handle'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            tint?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<{
                name?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                color?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                image?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    }
                  >;
                }>;
              }>;
            }>;
            textureImg?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            }>;
            galleryMedias?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  | (Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                  | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      sources: Array<
                        Pick<
                          StorefrontAPI.VideoSource,
                          'url' | 'mimeType' | 'width' | 'format' | 'height'
                        >
                      >;
                    })
                >;
              }>;
            }>;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
            finish?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            protector?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            hideFromBundle?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            accordion?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  title?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  text?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }
        >;
      };
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<
            StorefrontAPI.Product,
            'title' | 'productType' | 'handle'
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          tint?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<{
              name?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              color?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              image?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  }
                >;
              }>;
            }>;
          }>;
          textureImg?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          }>;
          galleryMedias?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'mimeType' | 'width' | 'format' | 'height'
                      >
                    >;
                  })
              >;
            }>;
          }>;
          badges?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  text?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }>;
          finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          protector?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          hideFromBundle?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          accordion?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                title?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }
      >;
      canonicalCollection?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Collection, 'handle' | 'title'> & {
            parentCollection?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Collection, 'handle' | 'title'> & {
                  parentCollection?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Collection, 'handle' | 'title'>
                    >;
                  }>;
                }
              >;
            }>;
          }
        >;
      }>;
      canonicalProduct?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Product, 'handle' | 'title'>
        >;
      }>;
      defaultVariant?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<
              StorefrontAPI.Product,
              'title' | 'productType' | 'handle'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            tint?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<{
                name?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                color?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                image?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    }
                  >;
                }>;
              }>;
            }>;
            textureImg?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            }>;
            galleryMedias?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  | (Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                  | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      sources: Array<
                        Pick<
                          StorefrontAPI.VideoSource,
                          'url' | 'mimeType' | 'width' | 'format' | 'height'
                        >
                      >;
                    })
                >;
              }>;
            }>;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
            finish?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            protector?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            hideFromBundle?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            accordion?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  title?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  text?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }
        >;
      }>;
      badges?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      reassurances?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      mainColor?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metaobject, 'id'> & {
            name?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            code?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
          }
        >;
      }>;
      associatedProducts?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
              variants: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.ProductVariant,
                    'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
                  > & {
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    product: Pick<
                      StorefrontAPI.Product,
                      'title' | 'productType' | 'handle'
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    tint?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<{
                        name?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                        color?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                        image?: StorefrontAPI.Maybe<{
                          reference?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            }
                          >;
                        }>;
                      }>;
                    }>;
                    textureImg?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        }
                      >;
                    }>;
                    galleryMedias?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<
                              StorefrontAPI.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Video,
                              'alt' | 'mediaContentType'
                            > & {
                              previewImage?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                              sources: Array<
                                Pick<
                                  StorefrontAPI.VideoSource,
                                  | 'url'
                                  | 'mimeType'
                                  | 'width'
                                  | 'format'
                                  | 'height'
                                >
                              >;
                            })
                        >;
                      }>;
                    }>;
                    badges?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          Pick<StorefrontAPI.Metaobject, 'id'> & {
                            text?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MetaobjectField, 'value'>
                            >;
                          }
                        >;
                      }>;
                    }>;
                    finish?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    protector?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    hideFromBundle?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    accordion?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Metaobject, 'id'> & {
                          title?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                          text?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }
                      >;
                    }>;
                  }
                >;
              };
              mainColor?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    name?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    code?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
              defaultVariant?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.ProductVariant,
                    'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
                  > & {
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    product: Pick<
                      StorefrontAPI.Product,
                      'title' | 'productType' | 'handle'
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    tint?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<{
                        name?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                        color?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                        image?: StorefrontAPI.Maybe<{
                          reference?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            }
                          >;
                        }>;
                      }>;
                    }>;
                    textureImg?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        }
                      >;
                    }>;
                    galleryMedias?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<
                              StorefrontAPI.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Video,
                              'alt' | 'mediaContentType'
                            > & {
                              previewImage?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                              sources: Array<
                                Pick<
                                  StorefrontAPI.VideoSource,
                                  | 'url'
                                  | 'mimeType'
                                  | 'width'
                                  | 'format'
                                  | 'height'
                                >
                              >;
                            })
                        >;
                      }>;
                    }>;
                    badges?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          Pick<StorefrontAPI.Metaobject, 'id'> & {
                            text?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MetaobjectField, 'value'>
                            >;
                          }
                        >;
                      }>;
                    }>;
                    finish?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    protector?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    hideFromBundle?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    accordion?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Metaobject, 'id'> & {
                          title?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                          text?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }
                      >;
                    }>;
                  }
                >;
              }>;
            }
          >;
        }>;
      }>;
      favoriteShades?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
            > & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              product: Pick<
                StorefrontAPI.Product,
                'title' | 'productType' | 'handle'
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              tint?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  name?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  color?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  image?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.MediaImage,
                        'id' | 'mediaContentType'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'id' | 'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      }
                    >;
                  }>;
                }>;
              }>;
              textureImg?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  }
                >;
              }>;
              galleryMedias?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'id' | 'mediaContentType'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'id' | 'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                    | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'id' | 'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                        sources: Array<
                          Pick<
                            StorefrontAPI.VideoSource,
                            'url' | 'mimeType' | 'width' | 'format' | 'height'
                          >
                        >;
                      })
                  >;
                }>;
              }>;
              badges?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      text?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }
                  >;
                }>;
              }>;
              finish?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              protector?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              hideFromBundle?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              accordion?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    title?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }
          >;
        }>;
      }>;
      complementaryProducts?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'> & {
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<
                StorefrontAPI.Product,
                'id' | 'handle' | 'title' | 'vendor' | 'productType'
              > & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                variants: {
                  nodes: Array<
                    Pick<
                      StorefrontAPI.ProductVariant,
                      'id' | 'title' | 'availableForSale'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                      compareAtPrice?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                      >;
                      selectedOptions: Array<
                        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                      >;
                      tint?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<{
                          color?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }>;
                      }>;
                    }
                  >;
                };
                defaultVariant?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductVariant, 'id'>
                  >;
                }>;
                capacity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                badges?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                        text?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }
                    >;
                  }>;
                }>;
              }
            >;
          }>;
        }
      >;
      accordions?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              title?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      featuresTitle?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      features?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              icon?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }>;
              }>;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      bundleComponents?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<
              StorefrontAPI.Product,
              'id' | 'handle' | 'title' | 'vendor' | 'productType'
            > & {
              featuredImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              variants: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.ProductVariant,
                    'id' | 'title' | 'availableForSale'
                  > & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    tint?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<{
                        color?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }>;
                    }>;
                  }
                >;
              };
              defaultVariant?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.ProductVariant, 'id'>
                >;
              }>;
              capacity?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              badges?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      text?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }
                  >;
                }>;
              }>;
            }
          >;
        }>;
      }>;
      videoSection?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
            title?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            text?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            file?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Video, 'alt'> & {
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  sources: Array<
                    Pick<
                      StorefrontAPI.VideoSource,
                      'url' | 'mimeType' | 'width' | 'format' | 'height'
                    >
                  >;
                }
              >;
            }>;
          }
        >;
      }>;
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type ManifestQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type ManifestQuery = {shop: Pick<StorefrontAPI.Shop, 'name'>};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'vendor' | 'productType'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  tint?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<{
                      color?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }>;
                  }>;
                }
              >;
            };
            defaultVariant?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductVariant, 'id'>
              >;
            }>;
            capacity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
      parentCollection?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Collection, 'handle' | 'title'> & {
            parentCollection?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Collection, 'handle' | 'title'>
              >;
            }>;
          }
        >;
      }>;
      seo: Pick<StorefrontAPI.Seo, 'title' | 'description'>;
    }
  >;
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'handle' | 'title'> & {
        order?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        parentCollection?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Collection, 'handle' | 'title'>
          >;
        }>;
      }
    >;
  };
};

export type ContactPageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.MetaobjectHandleInput;
}>;

export type ContactPageQuery = {
  contact?: StorefrontAPI.Maybe<{
    title?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
    description?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    formspreeId?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    address?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
    additionalInfo?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    seo?: StorefrontAPI.Maybe<{
      title?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
      description?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MetaobjectField, 'value'>
      >;
    }>;
  }>;
};

export type FaqPageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.MetaobjectHandleInput;
}>;

export type FaqPageQuery = {
  faq?: StorefrontAPI.Maybe<{
    title?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
    description?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    sections?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
            title?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            accordion?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    title?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
          }
        >;
      }>;
    }>;
    additionalInfo?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    seo?: StorefrontAPI.Maybe<{
      title?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
      description?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MetaobjectField, 'value'>
      >;
    }>;
  }>;
};

export type ProductVariantLookupQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductVariantLookupQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Product, 'id' | 'handle'> & {
      variants: {
        nodes: Array<
          Pick<StorefrontAPI.ProductVariant, 'id'> & {
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          }
        >;
      };
    }
  >;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'productType' | 'vendor' | 'handle' | 'description'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      media: {
        nodes: Array<
          | Pick<StorefrontAPI.ExternalVideo, 'id' | 'mediaContentType'>
          | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
          | Pick<StorefrontAPI.Model3d, 'id' | 'mediaContentType'>
          | (Pick<StorefrontAPI.Video, 'id' | 'mediaContentType' | 'alt'> & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              sources: Array<
                Pick<
                  StorefrontAPI.VideoSource,
                  'url' | 'mimeType' | 'width' | 'format' | 'height'
                >
              >;
            })
        >;
      };
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<
              StorefrontAPI.Product,
              'title' | 'productType' | 'handle'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            tint?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<{
                name?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                color?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                image?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    }
                  >;
                }>;
              }>;
            }>;
            textureImg?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            }>;
            galleryMedias?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  | (Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                  | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      sources: Array<
                        Pick<
                          StorefrontAPI.VideoSource,
                          'url' | 'mimeType' | 'width' | 'format' | 'height'
                        >
                      >;
                    })
                >;
              }>;
            }>;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
            finish?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            protector?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            hideFromBundle?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            accordion?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  title?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  text?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }
        >;
      };
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<
            StorefrontAPI.Product,
            'title' | 'productType' | 'handle'
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          tint?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<{
              name?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              color?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              image?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  }
                >;
              }>;
            }>;
          }>;
          textureImg?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          }>;
          galleryMedias?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                | (Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
                | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'url' | 'mimeType' | 'width' | 'format' | 'height'
                      >
                    >;
                  })
              >;
            }>;
          }>;
          badges?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  text?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }>;
          finish?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          protector?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          hideFromBundle?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          accordion?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                title?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }
      >;
      canonicalCollection?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Collection, 'handle' | 'title'> & {
            parentCollection?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Collection, 'handle' | 'title'> & {
                  parentCollection?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Collection, 'handle' | 'title'>
                    >;
                  }>;
                }
              >;
            }>;
          }
        >;
      }>;
      canonicalProduct?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Product, 'handle' | 'title'>
        >;
      }>;
      defaultVariant?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<
              StorefrontAPI.Product,
              'title' | 'productType' | 'handle'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            tint?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<{
                name?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                color?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
                image?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    }
                  >;
                }>;
              }>;
            }>;
            textureImg?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            }>;
            galleryMedias?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  | (Pick<
                      StorefrontAPI.MediaImage,
                      'id' | 'mediaContentType'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                  | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      sources: Array<
                        Pick<
                          StorefrontAPI.VideoSource,
                          'url' | 'mimeType' | 'width' | 'format' | 'height'
                        >
                      >;
                    })
                >;
              }>;
            }>;
            badges?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }>;
            finish?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            protector?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            hideFromBundle?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            accordion?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metaobject, 'id'> & {
                  title?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  text?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }
              >;
            }>;
          }
        >;
      }>;
      badges?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      reassurances?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      mainColor?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metaobject, 'id'> & {
            name?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            code?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
          }
        >;
      }>;
      associatedProducts?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
              variants: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.ProductVariant,
                    'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
                  > & {
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    product: Pick<
                      StorefrontAPI.Product,
                      'title' | 'productType' | 'handle'
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    tint?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<{
                        name?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                        color?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                        image?: StorefrontAPI.Maybe<{
                          reference?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            }
                          >;
                        }>;
                      }>;
                    }>;
                    textureImg?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        }
                      >;
                    }>;
                    galleryMedias?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<
                              StorefrontAPI.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Video,
                              'alt' | 'mediaContentType'
                            > & {
                              previewImage?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                              sources: Array<
                                Pick<
                                  StorefrontAPI.VideoSource,
                                  | 'url'
                                  | 'mimeType'
                                  | 'width'
                                  | 'format'
                                  | 'height'
                                >
                              >;
                            })
                        >;
                      }>;
                    }>;
                    badges?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          Pick<StorefrontAPI.Metaobject, 'id'> & {
                            text?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MetaobjectField, 'value'>
                            >;
                          }
                        >;
                      }>;
                    }>;
                    finish?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    protector?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    hideFromBundle?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    accordion?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Metaobject, 'id'> & {
                          title?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                          text?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }
                      >;
                    }>;
                  }
                >;
              };
              mainColor?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    name?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    code?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
              defaultVariant?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.ProductVariant,
                    'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
                  > & {
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    product: Pick<
                      StorefrontAPI.Product,
                      'title' | 'productType' | 'handle'
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    tint?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<{
                        name?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                        color?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                        image?: StorefrontAPI.Maybe<{
                          reference?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            }
                          >;
                        }>;
                      }>;
                    }>;
                    textureImg?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.MediaImage,
                          'id' | 'mediaContentType'
                        > & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        }
                      >;
                    }>;
                    galleryMedias?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<
                              StorefrontAPI.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Video,
                              'alt' | 'mediaContentType'
                            > & {
                              previewImage?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'id' | 'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                              sources: Array<
                                Pick<
                                  StorefrontAPI.VideoSource,
                                  | 'url'
                                  | 'mimeType'
                                  | 'width'
                                  | 'format'
                                  | 'height'
                                >
                              >;
                            })
                        >;
                      }>;
                    }>;
                    badges?: StorefrontAPI.Maybe<{
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          Pick<StorefrontAPI.Metaobject, 'id'> & {
                            text?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MetaobjectField, 'value'>
                            >;
                          }
                        >;
                      }>;
                    }>;
                    finish?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    protector?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    hideFromBundle?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metafield, 'value'>
                    >;
                    accordion?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Metaobject, 'id'> & {
                          title?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                          text?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }
                      >;
                    }>;
                  }
                >;
              }>;
            }
          >;
        }>;
      }>;
      favoriteShades?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'availableForSale' | 'id' | 'sku' | 'barcode' | 'title'
            > & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              product: Pick<
                StorefrontAPI.Product,
                'title' | 'productType' | 'handle'
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              tint?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  name?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  color?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  image?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.MediaImage,
                        'id' | 'mediaContentType'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'id' | 'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      }
                    >;
                  }>;
                }>;
              }>;
              textureImg?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MediaImage, 'id' | 'mediaContentType'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  }
                >;
              }>;
              galleryMedias?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'id' | 'mediaContentType'
                      > & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'id' | 'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                    | (Pick<StorefrontAPI.Video, 'alt' | 'mediaContentType'> & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'id' | 'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                        sources: Array<
                          Pick<
                            StorefrontAPI.VideoSource,
                            'url' | 'mimeType' | 'width' | 'format' | 'height'
                          >
                        >;
                      })
                  >;
                }>;
              }>;
              badges?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      text?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }
                  >;
                }>;
              }>;
              finish?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              protector?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              hideFromBundle?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              accordion?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metaobject, 'id'> & {
                    title?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                    text?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MetaobjectField, 'value'>
                    >;
                  }
                >;
              }>;
            }
          >;
        }>;
      }>;
      complementaryProducts?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'> & {
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<
                StorefrontAPI.Product,
                'id' | 'handle' | 'title' | 'vendor' | 'productType'
              > & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                variants: {
                  nodes: Array<
                    Pick<
                      StorefrontAPI.ProductVariant,
                      'id' | 'title' | 'availableForSale'
                    > & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                      compareAtPrice?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                      >;
                      selectedOptions: Array<
                        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                      >;
                      tint?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<{
                          color?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MetaobjectField, 'value'>
                          >;
                        }>;
                      }>;
                    }
                  >;
                };
                defaultVariant?: StorefrontAPI.Maybe<{
                  reference?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductVariant, 'id'>
                  >;
                }>;
                capacity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metafield, 'value'>
                >;
                badges?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Metaobject, 'id'> & {
                        text?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }
                    >;
                  }>;
                }>;
              }
            >;
          }>;
        }
      >;
      accordions?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              title?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      featuresTitle?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      features?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              icon?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }>;
              }>;
              text?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
            }
          >;
        }>;
      }>;
      bundleComponents?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<
              StorefrontAPI.Product,
              'id' | 'handle' | 'title' | 'vendor' | 'productType'
            > & {
              featuredImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              variants: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.ProductVariant,
                    'id' | 'title' | 'availableForSale'
                  > & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    tint?: StorefrontAPI.Maybe<{
                      reference?: StorefrontAPI.Maybe<{
                        color?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MetaobjectField, 'value'>
                        >;
                      }>;
                    }>;
                  }
                >;
              };
              defaultVariant?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.ProductVariant, 'id'>
                >;
              }>;
              capacity?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              badges?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id'> & {
                      text?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.MetaobjectField, 'value'>
                      >;
                    }
                  >;
                }>;
              }>;
            }
          >;
        }>;
      }>;
      videoSection?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
            title?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            text?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MetaobjectField, 'value'>
            >;
            file?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Video, 'alt'> & {
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  sources: Array<
                    Pick<
                      StorefrontAPI.VideoSource,
                      'url' | 'mimeType' | 'width' | 'format' | 'height'
                    >
                  >;
                }
              >;
            }>;
          }
        >;
      }>;
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type RegularSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  term: StorefrontAPI.Scalars['String']['input'];
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type RegularSearchQuery = {
  products: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'productType'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              tint?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<{
                  color?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                }>;
              }>;
            }
          >;
        };
        defaultVariant?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'>
          >;
        }>;
        capacity?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        badges?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id'> & {
                text?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MetaobjectField, 'value'>
                >;
              }
            >;
          }>;
        }>;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type StoresPageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.MetaobjectHandleInput;
}>;

export type StoresPageQuery = {
  storesPage?: StorefrontAPI.Maybe<{
    title?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
    description?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MetaobjectField, 'value'>
    >;
    seo?: StorefrontAPI.Maybe<{
      title?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
      description?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MetaobjectField, 'value'>
      >;
    }>;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  query Footer(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: MetaobjectHandleInput!\n    $footerMenuHandle: String!\n    $legalMenuHandle: String!\n  ) @inContext(language: $language, country: $country) {\n    content: metaobject(handle: $handle) {\n      labelFooter: field(key: "label_footer") {\n        value\n      }\n      youtubeUrl: field(key: "youtube_url") {\n        value\n      }\n      facebookUrl: field(key: "facebook_url") {\n        value\n      }\n      instagramUrl: field(key: "instagram_url") {\n        value\n      }\n      paymentIcons: field(key: "payments_icons") {\n        references(first: 10) {\n          nodes {\n            ... on MediaImage {\n              image {\n                ...Image\n              }\n            }\n          }\n        }\n      }\n      labelRights: field(key: "label_rights") {\n        value\n      }\n      labelSiteBy: field(key: "label_site_by") {\n        value\n      }\n    }\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n    legalMenu: menu(handle: $legalMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment SubMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...SubMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  fragment LauncherItem on Metaobject {\n    id\n    type\n    handle\n    collection: field(key: "collection") {\n      reference {\n        ... CollectionItem\n      }\n    }\n    product: field(key: "product") {\n      reference {\n        ...ProductItem\n      }\n    }\n  }\n  fragment CollectionMenu on Collection {\n      id\n      handle\n      title\n      highlightCollection: metafield(namespace: "custom", key: "highlight_collection") {\n        value\n      }\n      relatedCollections: metafield(namespace: "custom", key: "related_collections") {\n        references(first: 20) {\n          nodes {\n            ... CollectionItem\n          }\n        }\n      }\n      concernsCollections: metafield(namespace: "custom", key: "concerns") {\n        references(first: 20) {\n          nodes {\n            ... CollectionItem\n          }\n        }\n      }\n      highlightItems: metafield(namespace: "custom", key: "highlight_items"){\n        references(first: 2) {\n          nodes {\n            ... LauncherItem\n          }\n        }\n      }\n  }\n  query Header(\n    $language: LanguageCode\n    $country: CountryCode\n    $mainMenuHandle: String!\n    $secondaryMenuHandle: String!\n    $secondaryMenuMobileHandle: String!\n    $menuHandle: MetaobjectHandleInput!\n    $first: Int,\n    $priceMin: Float = 0.1\n  ) @inContext(language: $language, country: $country) {\n    mainMenu : menu(handle: $mainMenuHandle) {\n      ...Menu\n    }\n    secondaryMenu: menu(handle: $secondaryMenuHandle) {\n      ...Menu\n    }\n    secondaryMenuMobile: menu(handle: $secondaryMenuMobileHandle) {\n      ...Menu\n    }\n    menu: metaobject(handle: $menuHandle) {\n      title: field(key: "title") {\n        value\n      }\n      labelCategories: field(key: "label_categories") {\n        value\n      }\n      categories: field(key: "categories") {\n        references(first: 10) {\n          nodes {\n            ... CollectionMenu\n          }\n        }\n      }\n      labelSeeAll: field(key: "label_see_all") {\n        value\n      }\n      labelConcerns: field(key: "label_concerns") {\n        value\n      }\n      labelLaunchers: field(key: "label_launchers") {\n        value\n      }\n      collectionsHighlight: field(key: "collections_highlight") {\n        references(first: 2) {\n          nodes {\n            ... CollectionItem\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment SubMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...SubMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n  #graphql\n  fragment ImageCollectionItem on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment VideoSource on VideoSource {\n    url\n    mimeType\n    width\n    format\n    height\n  }\n  fragment CollectionItem on Collection {\n    id\n    handle\n    title\n    image {\n      ...ImageCollectionItem\n    }\n    posterVideo: metafield(namespace: "custom", key: "poster_video") {\n      reference{\n        ... on Video {\n          alt\n          previewImage{\n            ...ImageCollectionItem\n          }\n          sources {\n            ...VideoSource\n          }\n        }\n      }\n    }\n    products(first: $first, filters: {price: {min: $priceMin}}) {\n      nodes {\n        ...ProductItem\n      }\n    }\n  }\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\nfragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  query Shop(\n    $language: LanguageCode\n    $country: CountryCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      id\n      name\n      description\n      primaryDomain {\n        url\n      }\n      brand {\n        shortDescription\n        logo {\n          image {\n            ...Image\n          }\n        }\n        coverImage {\n          image {\n            ...Image\n          }\n        }\n      }\n      paymentSettings {\n        currencyCode\n      }\n    }\n  }\n': {
    return: ShopQuery;
    variables: ShopQueryVariables;
  };
  '#graphql\n  query Global(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: MetaobjectHandleInput!\n  ) @inContext(language: $language, country: $country) {\n    global: metaobject(handle: $handle) {\n      announcements: field(key: "announcements") {\n        references(first: 10) {\n          nodes {\n            ... on Metaobject {\n              id\n              title: field(key: "title") {\n                value\n              }\n              link: field(key: "link") {\n                value\n              }\n            }\n          }\n        }\n      }\n      ctas: field(key: "ctas") {\n        references(first: 2) {\n          nodes {\n            ... on Metaobject {\n              id\n              picto: field(key: "picto") {\n                reference {\n                  ... on MediaImage {\n                    image {\n                      id\n                      url\n                      altText\n                      width\n                      height\n                    }\n                  }\n                }\n              }\n              title: field(key: "title") {\n                value\n              }\n              text: field(key: "text") {\n                value\n              }\n              link: field(key: "link") {\n                reference {\n                  ... on Metaobject {\n                    text: field(key: "text") {\n                        value\n                    }\n                    url: field(key: "url") {\n                      value\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n      reassurances: field(key: "reassurances") {\n        references(first: 3) {\n          nodes {\n            ... on Metaobject {\n              id\n              title: field(key: "title") {\n                value\n              }\n              text: field(key: "text") {\n                value\n              }\n            }\n          }\n        }\n      }\n      newsletter: field(key: "newsletter") {\n        reference {\n          ... on Metaobject {\n            title: field(key: "title") {\n              value\n            }\n            subtitle: field(key: "subtitle") {\n              value\n            }\n          }\n        }\n      }\n      relatedProductsEmptyCard: field(key: "related_products_empty_card") {\n        references(first: 10) {\n          nodes{\n            ...ProductItem\n          }\n        }\n      }\n      relatedProductsAccount: field(key: "related_products_account") {\n        references(first: 10) {\n          nodes{\n            ...ProductItem\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n': {
    return: GlobalQuery;
    variables: GlobalQueryVariables;
  };
  '#graphql\n  query CollectionItemResource(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $first: Int,\n    $priceMin: Float\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      ...CollectionItem\n    }\n  }\n  #graphql\n  fragment ImageCollectionItem on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment VideoSource on VideoSource {\n    url\n    mimeType\n    width\n    format\n    height\n  }\n  fragment CollectionItem on Collection {\n    id\n    handle\n    title\n    image {\n      ...ImageCollectionItem\n    }\n    posterVideo: metafield(namespace: "custom", key: "poster_video") {\n      reference{\n        ... on Video {\n          alt\n          previewImage{\n            ...ImageCollectionItem\n          }\n          sources {\n            ...VideoSource\n          }\n        }\n      }\n    }\n    products(first: $first, filters: {price: {min: $priceMin}}) {\n      nodes {\n        ...ProductItem\n      }\n    }\n  }\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n\n': {
    return: CollectionItemResourceQuery;
    variables: CollectionItemResourceQueryVariables;
  };
  '#graphql\n  query ProductItemResource(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: String!\n  ) @inContext(language: $language, country: $country) {\n    product(handle: $handle) {\n      ...ProductItem\n    }\n  }\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n': {
    return: ProductItemResourceQuery;
    variables: ProductItemResourceQueryVariables;
  };
  '#graphql\n  query ProductRecommendations(\n    $productHandle: String!\n    $language: LanguageCode\n    $country: CountryCode\n  ) @inContext(language: $language, country: $country) {\n    productRecommendations(productHandle: $productHandle) {\n      ...ProductItem\n    }\n  }\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n': {
    return: ProductRecommendationsQuery;
    variables: ProductRecommendationsQueryVariables;
  };
  '#graphql\n  query ProductResource(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: String!\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(language: $language, country: $country) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  #graphql\n  fragment ImageProduct on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment Video on Video {\n    alt\n    previewImage{\n      ...ImageProduct\n    }\n    sources {\n      ...VideoSource\n    }\n  }\n  fragment VideoSource on VideoSource {\n    url\n    mimeType\n    width\n    format\n    height\n  }\n  fragment MainColor on Product{\n    id\n    title\n    handle\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    mainColor: metafield(namespace: "custom", key: "maincolor") {\n      reference {\n        ...on Metaobject{\n          id\n          name: field(key: "name") {\n            value\n          }\n          code: field(key: "code") {\n            value\n          }\n        }\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ...ProductVariant\n      }\n    }\n  }\n  fragment Product on Product {\n    id\n    title\n    productType\n    vendor\n    handle\n    description\n    featuredImage {\n      ...ImageProduct\n    }\n    media(first: 100) {\n      nodes {\n        id\n        mediaContentType\n        ... on MediaImage {\n          image {\n            ...ImageProduct\n          }\n        }\n        ...Video\n      }\n    }\n    options {\n      name\n      optionValues {\n        name\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n      ...ProductVariant\n    }\n    canonicalCollection: metafield(namespace: "custom", key: "canonical_collection") {\n      reference {\n        ... on Collection {\n          handle\n          title\n          parentCollection: metafield(namespace: "custom", key: "parent_collection") {\n            reference {\n              ... on Collection {\n                handle\n                title\n                parentCollection: metafield(namespace: "custom", key: "parent_collection") {\n                  reference {\n                    ... on Collection {\n                      handle\n                      title\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    canonicalProduct: metafield(namespace: "custom", key: "canonical_product") {\n      reference {\n        ... on Product {\n          handle\n          title\n        }\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ...ProductVariant\n      }\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    reassurances: metafield(namespace: "custom", key: "reassurances") {\n      references(first: 3) {\n        nodes {\n          ...on Metaobject {\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    mainColor: metafield(namespace: "custom", key: "maincolor") {\n      reference {\n        ...on Metaobject{\n          id\n          name: field(key: "name") {\n            value\n          }\n          code: field(key: "code") {\n            value\n          }\n        }\n      }\n    }\n    associatedProducts: metafield(namespace: "custom", key: "associated_products") {\n      references(first: 20) {\n        nodes {\n          ...on Product{\n            ...MainColor\n          }\n        }\n      }\n    }\n    favoriteShades: metafield(namespace: "custom", key: "favorite_shades") {\n      references(first: 6) {\n        nodes {\n          ...ProductVariant\n        }\n      }\n    }\n    complementaryProducts: metafield(\n      namespace: "shopify--discovery--product_recommendation"\n      key: "complementary_products"\n    ) {\n      value\n      references(first: 10) {\n        nodes {\n          ...ProductItem\n        }\n      }\n    }\n    accordions: metafield(namespace: "custom", key: "accordions") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            id\n            title: field(key: "title") {\n              value\n            }\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    featuresTitle: metafield(namespace: "custom", key: "features_title") {\n      value\n    }\n    features: metafield(namespace: "custom", key: "features") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            id\n            icon: field(key: "icon") {\n              reference {\n                ... on MediaImage {\n                  image {\n                    ...ImageProduct\n                  }\n                }\n              }\n            }\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    bundleComponents: metafield(namespace: "custom", key: "bundle_components") {\n      references(first: 10) {\n        nodes {\n          ...ProductItem\n        }\n      }\n    }\n    videoSection: metafield(namespace: "custom", key: "video_section") {\n      reference {\n        ...on Metaobject{\n          id\n          type\n          title: field(key: "title") {\n            value\n          }\n          text: field(key: "text") {\n            value\n          }\n          file: field(key: "file") {\n            reference{\n              ...Video\n            }\n          }\n        }\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment ImageProductVariant on Image{\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment VideoSourceVariant on VideoSource {\n    url\n    mimeType\n    width\n    format\n    height\n  }\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      ...ImageProductVariant\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      productType\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    barcode\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          name: field(key: "name") {\n            value\n          }\n          color: field(key: "color") {\n            value\n          }\n          image: field(key: "image") {\n            reference{\n              ... on MediaImage{\n                id\n                mediaContentType\n                image{\n                  ...ImageProductVariant\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    textureImg: metafield(namespace: "custom", key: "texture_img") {\n      reference{\n        ... on MediaImage {\n          id\n          mediaContentType\n          image {\n            ...ImageProductVariant\n          }\n        }\n      }\n    }\n    galleryMedias: metafield(namespace: "custom", key: "gallery_medias") {\n      references(first: 100) {\n        nodes {\n          ... on MediaImage {\n            id\n            mediaContentType\n            image {\n              ...ImageProductVariant\n            }\n          }\n          ... on Video {\n            alt\n            mediaContentType\n            previewImage{\n              ...ImageProductVariant\n            }\n            sources {\n              ...VideoSourceVariant\n            }\n          }\n        }\n      }\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    finish: metafield(namespace: "custom", key: "finish") {\n      value\n    }\n    protector: metafield(namespace: "custom", key: "protector") {\n      value\n    }\n    hideFromBundle: metafield(namespace: "custom", key: "hide_from_bundle") {\n      value\n    }\n    accordion: metafield(namespace: "custom", key: "accordion") {\n      reference {\n        ... on Metaobject {\n          id\n          title: field(key: "title") {\n            value\n          }\n          text: field(key: "text") {\n            value\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductResourceQuery;
    variables: ProductResourceQueryVariables;
  };
  '#graphql\n  query Manifest {\n    shop {\n      name\n    }\n  }\n': {
    return: ManifestQuery;
    variables: ManifestQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n  query Collection(\n    $handle: String!\n    $language: LanguageCode\n    $country: CountryCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language, country: $country) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      image {\n        id\n        url\n        altText\n        width\n        height\n      }\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        sortKey: COLLECTION_DEFAULT,\n        filters: {price: {min: 0.1}}\n      ) {\n        nodes {\n          ...ProductItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n      parentCollection: metafield(namespace: "custom", key: "parent_collection") {\n        reference {\n          ... on Collection {\n            handle\n            title\n            parentCollection: metafield(namespace: "custom", key: "parent_collection") {\n              reference {\n                ... on Collection {\n                  handle\n                  title\n                }\n              }\n            }\n          }\n        }\n      }\n      seo {\n        title\n        description\n      }\n    }\n    collections(first: 100, sortKey: RELEVANCE) {\n      nodes {\n        handle\n        title\n        order: metafield(namespace: "custom", key: "order") {\n          value\n        }\n        parentCollection: metafield(namespace: "custom", key: "parent_collection") {\n          reference {\n            ... on Collection {\n              handle\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  query ContactPage(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: MetaobjectHandleInput!\n  ) @inContext(language: $language, country: $country) {\n    contact: metaobject(handle: $handle) {\n      title: field(key: "title") {\n        value\n      }\n      description: field(key: "description") {\n        value\n      }\n      formspreeId: field(key: "formspree_id") {\n        value\n      }\n      address: field(key: "address") {\n        value\n      }\n      additionalInfo: field(key: "additional_info") {\n        value\n      }\n      seo {\n        title {\n          value\n        }\n        description {\n          value\n        }\n      }\n    }\n  }\n': {
    return: ContactPageQuery;
    variables: ContactPageQueryVariables;
  };
  '#graphql\n  query FaqPage(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: MetaobjectHandleInput!\n  ) @inContext(language: $language, country: $country) {\n    faq: metaobject(handle: $handle) {\n      title: field(key: "title") {\n        value\n      }\n      description: field(key: "description") {\n        value\n      }\n      sections: field(key: "sections") {\n        references(first: 20) {\n          nodes {\n            ... on Metaobject {\n              id\n              type\n              title: field(key: "title") {\n                value\n              },\n              accordion: field(key: "accordion") {\n                references(first: 50) {\n                  nodes {\n                    ... on Metaobject {\n                      id\n                      title: field(key: "title") {\n                        value\n                      }\n                      text: field(key: "text") {\n                        value\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n      additionalInfo: field(key: "additional_info") {\n        value\n      }\n      seo {\n        title {\n          value\n        }\n        description {\n          value\n        }\n      }\n    }\n  }\n': {
    return: FaqPageQuery;
    variables: FaqPageQueryVariables;
  };
  '#graphql\n  query ProductVariantLookup(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: String!\n  ) @inContext(language: $language, country: $country) {\n    product(handle: $handle) {\n      id\n      handle\n      variants(first: 250) {\n        nodes {\n          id\n          selectedOptions {\n            name\n            value\n          }\n        }\n      }\n    }\n  }\n': {
    return: ProductVariantLookupQuery;
    variables: ProductVariantLookupQueryVariables;
  };
  '#graphql\n  query Product(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: String!\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(language: $language, country: $country) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  #graphql\n  fragment ImageProduct on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment Video on Video {\n    alt\n    previewImage{\n      ...ImageProduct\n    }\n    sources {\n      ...VideoSource\n    }\n  }\n  fragment VideoSource on VideoSource {\n    url\n    mimeType\n    width\n    format\n    height\n  }\n  fragment MainColor on Product{\n    id\n    title\n    handle\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    mainColor: metafield(namespace: "custom", key: "maincolor") {\n      reference {\n        ...on Metaobject{\n          id\n          name: field(key: "name") {\n            value\n          }\n          code: field(key: "code") {\n            value\n          }\n        }\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ...ProductVariant\n      }\n    }\n  }\n  fragment Product on Product {\n    id\n    title\n    productType\n    vendor\n    handle\n    description\n    featuredImage {\n      ...ImageProduct\n    }\n    media(first: 100) {\n      nodes {\n        id\n        mediaContentType\n        ... on MediaImage {\n          image {\n            ...ImageProduct\n          }\n        }\n        ...Video\n      }\n    }\n    options {\n      name\n      optionValues {\n        name\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n      ...ProductVariant\n    }\n    canonicalCollection: metafield(namespace: "custom", key: "canonical_collection") {\n      reference {\n        ... on Collection {\n          handle\n          title\n          parentCollection: metafield(namespace: "custom", key: "parent_collection") {\n            reference {\n              ... on Collection {\n                handle\n                title\n                parentCollection: metafield(namespace: "custom", key: "parent_collection") {\n                  reference {\n                    ... on Collection {\n                      handle\n                      title\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    canonicalProduct: metafield(namespace: "custom", key: "canonical_product") {\n      reference {\n        ... on Product {\n          handle\n          title\n        }\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ...ProductVariant\n      }\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    reassurances: metafield(namespace: "custom", key: "reassurances") {\n      references(first: 3) {\n        nodes {\n          ...on Metaobject {\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    mainColor: metafield(namespace: "custom", key: "maincolor") {\n      reference {\n        ...on Metaobject{\n          id\n          name: field(key: "name") {\n            value\n          }\n          code: field(key: "code") {\n            value\n          }\n        }\n      }\n    }\n    associatedProducts: metafield(namespace: "custom", key: "associated_products") {\n      references(first: 20) {\n        nodes {\n          ...on Product{\n            ...MainColor\n          }\n        }\n      }\n    }\n    favoriteShades: metafield(namespace: "custom", key: "favorite_shades") {\n      references(first: 6) {\n        nodes {\n          ...ProductVariant\n        }\n      }\n    }\n    complementaryProducts: metafield(\n      namespace: "shopify--discovery--product_recommendation"\n      key: "complementary_products"\n    ) {\n      value\n      references(first: 10) {\n        nodes {\n          ...ProductItem\n        }\n      }\n    }\n    accordions: metafield(namespace: "custom", key: "accordions") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            id\n            title: field(key: "title") {\n              value\n            }\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    featuresTitle: metafield(namespace: "custom", key: "features_title") {\n      value\n    }\n    features: metafield(namespace: "custom", key: "features") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            id\n            icon: field(key: "icon") {\n              reference {\n                ... on MediaImage {\n                  image {\n                    ...ImageProduct\n                  }\n                }\n              }\n            }\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    bundleComponents: metafield(namespace: "custom", key: "bundle_components") {\n      references(first: 10) {\n        nodes {\n          ...ProductItem\n        }\n      }\n    }\n    videoSection: metafield(namespace: "custom", key: "video_section") {\n      reference {\n        ...on Metaobject{\n          id\n          type\n          title: field(key: "title") {\n            value\n          }\n          text: field(key: "text") {\n            value\n          }\n          file: field(key: "file") {\n            reference{\n              ...Video\n            }\n          }\n        }\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment ImageProductVariant on Image{\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment VideoSourceVariant on VideoSource {\n    url\n    mimeType\n    width\n    format\n    height\n  }\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      ...ImageProductVariant\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      productType\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    barcode\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          name: field(key: "name") {\n            value\n          }\n          color: field(key: "color") {\n            value\n          }\n          image: field(key: "image") {\n            reference{\n              ... on MediaImage{\n                id\n                mediaContentType\n                image{\n                  ...ImageProductVariant\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    textureImg: metafield(namespace: "custom", key: "texture_img") {\n      reference{\n        ... on MediaImage {\n          id\n          mediaContentType\n          image {\n            ...ImageProductVariant\n          }\n        }\n      }\n    }\n    galleryMedias: metafield(namespace: "custom", key: "gallery_medias") {\n      references(first: 100) {\n        nodes {\n          ... on MediaImage {\n            id\n            mediaContentType\n            image {\n              ...ImageProductVariant\n            }\n          }\n          ... on Video {\n            alt\n            mediaContentType\n            previewImage{\n              ...ImageProductVariant\n            }\n            sources {\n              ...VideoSourceVariant\n            }\n          }\n        }\n      }\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n    finish: metafield(namespace: "custom", key: "finish") {\n      value\n    }\n    protector: metafield(namespace: "custom", key: "protector") {\n      value\n    }\n    hideFromBundle: metafield(namespace: "custom", key: "hide_from_bundle") {\n      value\n    }\n    accordion: metafield(namespace: "custom", key: "accordion") {\n      reference {\n        ... on Metaobject {\n          id\n          title: field(key: "title") {\n            value\n          }\n          text: field(key: "text") {\n            value\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query RegularSearch(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $term: String!\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products: search(\n      after: $endCursor,\n      before: $startCursor,\n      first: $first,\n      last: $last,\n      query: $term,\n      sortKey: RELEVANCE,\n      types: [PRODUCT],\n      unavailableProducts: SHOW,\n      productFilters: [ {\n         price:  {\n            min: 0.1,\n         }\n      }]\n    ) {\n      nodes {\n        ...on Product {\n          ...ProductItem\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      totalCount\n    }\n  }\n  #graphql\n  fragment Image on Image {\n    id\n    url\n    altText\n    width\n    height\n  }\n  fragment ProductVariantItem on ProductVariant {\n    id\n    title\n    image {\n      ...Image\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    tint: metafield(namespace: "custom", key: "tint") {\n      reference {\n        ...on Metaobject{\n          color: field(key: "color") {\n            value\n          }\n        }\n      }\n    }\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    featuredImage {\n      ...Image\n    }\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantItem\n      }\n    }\n    defaultVariant: metafield(namespace: "custom", key: "default_variant") {\n      reference {\n        ... on ProductVariant {\n          id\n        }\n      }\n    }\n    capacity: metafield(namespace: "custom", key: "capacity") {\n      value\n    }\n    badges: metafield(namespace: "custom", key: "badges") {\n      references(first: 2) {\n        nodes {\n          ...on Metaobject{\n            id\n            text: field(key: "text") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n': {
    return: RegularSearchQuery;
    variables: RegularSearchQueryVariables;
  };
  '#graphql\n  query StoresPage(\n    $language: LanguageCode\n    $country: CountryCode\n    $handle: MetaobjectHandleInput!\n  ) @inContext(language: $language, country: $country) {\n    storesPage: metaobject(handle: $handle) {\n      title: field(key: "title") {\n        value\n      }\n      description: field(key: "description") {\n        value\n      }\n      seo {\n        title {\n          value\n        }\n        description {\n          value\n        }\n      }\n    }\n  }\n': {
    return: StoresPageQuery;
    variables: StoresPageQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
