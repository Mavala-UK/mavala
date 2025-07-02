import { useLoaderData, type MetaFunction } from 'react-router';
import {getSeoMeta} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {RootLoader} from '~/root';
import {getPolicyByHandle} from '~/lib/policies';
import {Breadcrumb} from '~/components/common/Breadcrumb';
import {PolicyMain} from '~/components/policy/PolicyMain';

export const meta: MetaFunction<typeof loader, {root: RootLoader}> = ({
  data,
  matches: [root],
}) => {
  return getSeoMeta(root.data.seo, {
    title: data?.policy.title,
  });
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policy = await getPolicyByHandle(context, params.handle);
  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: policy?.title,
          },
        ]}
      />
      <PolicyMain />
    </>
  );
}
