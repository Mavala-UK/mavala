import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {NEWSLETTER_SUBSCRIPTION_MUTATION} from '~/graphql/unstable-storefront/NewsletterSubscriptionMutation';
import {data} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const {unstable_storefront} = context;

  try {
    const {data, errors} = await unstable_storefront.request(
      NEWSLETTER_SUBSCRIPTION_MUTATION,
      {
        variables: {
          email: formData.get('email') as string,
        },
      },
    );

    if (errors?.graphQLErrors?.length) {
      throw new Error(errors.graphQLErrors[0].message);
    }

    if (data?.customerEmailMarketingSubscribe?.customerUserErrors?.length) {
      throw new Error(
        data.customerEmailMarketingSubscribe.customerUserErrors[0].message,
      );
    }

    return {error: null};
  } catch (error) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error: 'Bad request'},
      {
        status: 400,
      },
    );
  }
}

export async function loader({request}: LoaderFunctionArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}
