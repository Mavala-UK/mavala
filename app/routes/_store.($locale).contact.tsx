import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import { useLoaderData, type MetaFunction } from 'react-router';
import type {RootLoader} from '~/root';
import {getPolicyByHandle} from '~/lib/policies';
import {truncate} from '~/lib/utils';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import {ContactMain} from '~/components/contact/ContactMain';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  return getSeoMeta(root.data.seo, data?.seo);
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const {contact} = await storefront.query(CONTACT_PAGE_QUERY, {
    variables: {handle: {handle: 'contact', type: 'contact'}},
    cache: storefront.CacheShort(),
  });

  if (!contact) {
    throw new Response('Contact page not found', {status: 404});
  }

  const privacyPolicy = await getPolicyByHandle(context, 'privacy-policy');

  const {title, description} = contact?.seo ?? {};
  const seo = {
    title: title?.value ?? '',
    description: truncate(description?.value!) ?? '',
  } satisfies SeoConfig;

  return {contact, seo, privacyPolicy};
}

export default function Contact() {
  const {contact} = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: contact?.title?.value!,
          },
        ]}
      />
      <ContactMain />
    </>
  );
}

const CONTACT_PAGE_QUERY = `#graphql
  query ContactPage(
    $language: LanguageCode
    $country: CountryCode
    $handle: MetaobjectHandleInput!
  ) @inContext(language: $language, country: $country) {
    contact: metaobject(handle: $handle) {
      title: field(key: "title") {
        value
      }
      description: field(key: "description") {
        value
      }
      formspreeId: field(key: "formspree_id") {
        value
      }
      address: field(key: "address") {
        value
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
