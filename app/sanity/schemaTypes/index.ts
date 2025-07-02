import {articleCategoryType} from './documents/articleCategoryType';
import {articleLauncherType} from './documents/articleLauncherType';
import {articleType} from './documents/articleType';
import {collectionType} from './documents/collectionType';
import {pageType} from './documents/pageType';
import {productType} from './documents/productType';
import {productVariantType} from './documents/productVariantType';
import {collectionRuleType} from './objects/collectionRuleType';
import {editorialSectionType} from './objects/editorialSectionType';
import {heroType} from './objects/heroType';
import {hotPicksType} from './objects/hotPicksType';
import {focusCollectionType} from './objects/focusCollectionType';
import {featuredCollectionsType} from './objects/featuredCollectionsType';
import {featuredArticlesType} from './objects/featuredArticlesType';
import {inventoryType} from './objects/inventoryType';
import {linkType} from './objects/linkType';
import {optionType} from './objects/optionType';
import {priceRangeType} from './objects/priceRangeType';
import imageWithAltText from './objects/imageWithAltText';
import {productWithVariantType} from './objects/productWithVariantType';
import {proxyStringType} from './objects/proxyStringType';
import {seoSectionType} from './objects/seoSectionType';
import {faqSectionType} from './objects/faqSectionType';
import {seoType} from './objects/seoType';
import {insertType} from './objects/insertType';
import {shopifyCollectionType} from './objects/shopifyCollectionType';
import {shopifyProductType} from './objects/shopifyProductType';
import {shopifyProductVariantType} from './objects/shopifyProductVariantType';
import {
  portableTextType,
  portableTextEditorialType,
  portableTextArticleType,
} from './portableText/portableTextType';
import {homeType} from './singletons/homeType';
import {blogType} from './singletons/blogType';
import translation from './documents/translationType';
import {video, bunnyVideo} from './objects/videoType';
import {duoMedias} from './objects/duoMediasType';
import {productList} from './objects/productListType';
import {argumentsCarousel} from './objects/argumentsCarouselType';
import {galleryCarousel} from './objects/galleryCarouselType';
import {imageWithTextCarousel} from './objects/imageWithTextCarouselType';
import {chronologicalCarousel} from './objects/chronologicalCarouselType';
import {videoModuleType} from './documents/videoModuleType';
import {steps} from './objects/stepsType';
import {tinyImage} from './objects/tinyImageType';

const objects = [
  heroType,
  hotPicksType,
  focusCollectionType,
  editorialSectionType,
  featuredCollectionsType,
  featuredArticlesType,
  insertType,
  videoModuleType,
  imageWithAltText,
  collectionRuleType,
  inventoryType,
  linkType,
  optionType,
  priceRangeType,
  productWithVariantType,
  proxyStringType,
  seoSectionType,
  faqSectionType,
  seoType,
  shopifyCollectionType,
  shopifyProductType,
  shopifyProductVariantType,
  duoMedias,
  productList,
  argumentsCarousel,
  galleryCarousel,
  imageWithTextCarousel,
  chronologicalCarousel,
  steps,
  tinyImage,
  video,
  bunnyVideo,
];

const blocks = [
  portableTextType,
  portableTextEditorialType,
  portableTextArticleType,
];

const documents = [
  articleType,
  articleCategoryType,
  articleLauncherType,
  collectionType,
  pageType,
  productType,
  productVariantType,
  translation,
];

const singletons = [homeType, blogType];

export const schemaTypes = [...objects, ...singletons, ...blocks, ...documents];
