import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { type MetaFunction } from 'react-router';
import {getSeoMeta} from '@shopify/hydrogen';
import {RootLoader} from '~/root';
import {ACCOUNT_ROUTES} from '~/components/account/AccountMain';
import {ProfileForm} from '~/components/account/ProfileForm';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  matches: [root],
}) => {
  return [
    ...(getSeoMeta(root.data.seo, {
      title: root.data.translations.data.find(
        ({id}) => id === ACCOUNT_ROUTES.profile,
      )?.message,
    }) ?? []),
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    const customerData = data?.customerUpdate?.customer;

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!customerData) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: customerData,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  return <ProfileForm />;
}
