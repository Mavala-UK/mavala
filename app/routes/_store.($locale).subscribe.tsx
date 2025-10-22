import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {NEWSLETTER_SUBSCRIPTION_MUTATION} from '~/graphql/unstable-storefront/NewsletterSubscriptionMutation';
import {data} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const {unstable_storefront} = context;
  const email = formData.get('email') as string;

  try {
    const {data: result, errors} = await unstable_storefront.request(
      NEWSLETTER_SUBSCRIPTION_MUTATION,
      {
        variables: {
          email,
        },
      },
    );

    if (errors?.graphQLErrors?.length) {
      throw new Error(errors.graphQLErrors[0].message);
    }

    if (result?.customerEmailMarketingSubscribe?.customerUserErrors?.length) {
      throw new Error(
        result.customerEmailMarketingSubscribe.customerUserErrors[0].message,
      );
    }

    // Return success with email for client-side Omnisend tracking
    return {error: null, email, subscribed: true};
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
