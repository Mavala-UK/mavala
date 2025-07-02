import groq from 'groq';
import {imageFragment} from './imageFragment';
import {videoFragment} from './videoFragment';

// @sanity-typegen-ignore
export const portableTextFragment = groq`
  ...,
  _type,
  _type == "image" => {
    ${imageFragment}
  },
  _type == "video" => {
    ${videoFragment}
  },
  _type == "bunnyVideo" => {
    id
  },
  _type == "tinyMedia" => {
    ${imageFragment}
  },
  _type == "argumentsCarousel" => {
    _key,
    "subtitle": coalesce(
      subtitle[_key == $language][0].value,
      subtitle[0].value
    ),
    slides[] {
      _key,
      image {
        ${imageFragment}
      },
      "title": coalesce(
        title[_key == $language][0].value,
        title[0].value
      ),
      "text": coalesce(
        text[_key == $language][0].value,
        text[0].value
      ),
      sizeText
    }
  },
  _type == "duoMedias" => {
    _key,
    largeImage{
      ${imageFragment}
    },
    smallImage{
      ${imageFragment}
    },
    imagePosition
  },
  _type == "productList" => {
    products[]-> {
      _id,
      "slug": store.slug.current
    }
  },
  _type == "galleryCarousel" => {
    _key,
    medias[] {
      _type == "image" => {
        ${imageFragment}
      },
      _type == "video" => {
        ${videoFragment}
      },
    }
  },
  _type == "imageWithTextCarousel" => {
    slides[] {
      _key,
      image {
        ${imageFragment}
      },
      "text": coalesce(
        text[_key == $language][0].value,
        text[0].value
      ),
    }
  },
  _type == "chronologicalCarousel" => {
    slides[] {
      _key,
      image {
        ${imageFragment}
      },
      year,
      "title": coalesce(
        title[_key == $language][0].value,
        title[0].value
      ),
      "text": coalesce(
        text[_key == $language][0].value,
        text[0].value
      ),
    }
  },
  _type == "steps" => {
    steps[] {
      _key,
      image {
        ${imageFragment}
      },
      "title": coalesce(
        title[_key == $language][0].value,
        title[0].value
      ),
      "text": coalesce(
        text[_key == $language][0].value,
        text[0].value
      ),
    }
  },
`;
