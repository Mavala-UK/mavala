import {defineArrayMember, defineType} from 'sanity';

export const featuredArticlesType = defineType({
  name: 'featuredArticles',
  title: 'Articles mis en vant',
  type: 'array',
  of: [defineArrayMember({type: 'reference', to: [{type: 'article'}]})],
  validation: (Rule) => Rule.max(3),
});
