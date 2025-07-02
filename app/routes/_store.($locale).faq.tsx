import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import { useLoaderData, type MetaFunction } from 'react-router';
import type {RootLoader} from '~/root';
import {truncate} from '~/lib/utils';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import {FaqMain} from '~/components/faq/FaqMain';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  return getSeoMeta(root.data.seo, data?.seo);
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const {faq} = await storefront.query(FAQ_PAGE_QUERY, {
    variables: {handle: {handle: 'faq', type: 'faq'}},
    cache: storefront.CacheShort(),
  });

  if (!faq) {
    throw new Response('Faq page not found', {status: 404});
  }

  const {title, description} = faq?.seo ?? {};
  const seo = {
    title: title?.value ?? '',
    description: truncate(description?.value!) ?? '',
  } satisfies SeoConfig;

  return {faq, seo};
}

export default function Contact() {
  const {faq} = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: faq?.title?.value!,
          },
        ]}
      />
      <FaqMain />
    </>
  );
}

const FAQ_PAGE_QUERY = `#graphql
  query FaqPage(
    $language: LanguageCode
    $country: CountryCode
    $handle: MetaobjectHandleInput!
  ) @inContext(language: $language, country: $country) {
    faq: metaobject(handle: $handle) {
      title: field(key: "title") {
        value
      }
      description: field(key: "description") {
        value
      }
      sections: field(key: "sections") {
        references(first: 20) {
          nodes {
            ... on Metaobject {
              id
              type
              title: field(key: "title") {
                value
              },
              accordion: field(key: "accordion") {
                references(first: 50) {
                  nodes {
                    ... on Metaobject {
                      id
                      title: field(key: "title") {
                        value
                      }
                      text: field(key: "text") {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      additionalInfo: field(key: "additional_info") {
        value
      }
      seo {
        title {
          value
        }
        description {
          value
        }
      }
    }
  }
` as const;
