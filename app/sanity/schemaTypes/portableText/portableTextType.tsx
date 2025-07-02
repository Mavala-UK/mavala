import {defineArrayMember, defineType} from 'sanity';

export const portableTextType = defineType({
  title: 'Texte enrichi',
  name: 'portableText',
  type: 'array',
  of: [defineArrayMember({type: 'block'})],
});

export const portableTextEditorialType = defineType({
  title: 'Texte enrichi',
  name: 'portableTextEditorial',
  type: 'array',
  of: [
    defineArrayMember({type: 'block'}),
    defineArrayMember({type: 'image'}),
    defineArrayMember({type: 'video'}),
    defineArrayMember({type: 'bunnyVideo'}),
    defineArrayMember({type: 'argumentsCarousel'}),
    defineArrayMember({type: 'duoMedias'}),
    defineArrayMember({type: 'productList'}),
    defineArrayMember({type: 'galleryCarousel'}),
    defineArrayMember({type: 'imageWithTextCarousel'}),
    defineArrayMember({type: 'chronologicalCarousel'}),
  ],
});

export const portableTextArticleType = defineType({
  title: 'Texte enrichi',
  name: 'portableTextArticle',
  type: 'array',
  of: [
    defineArrayMember({type: 'block'}),
    defineArrayMember({type: 'image'}),
    defineArrayMember({type: 'video'}),
    defineArrayMember({type: 'bunnyVideo'}),
    defineArrayMember({type: 'tinyImage'}),
    defineArrayMember({type: 'steps'}),
    defineArrayMember({type: 'productList'}),
    defineArrayMember({type: 'galleryCarousel'}),
  ],
});
