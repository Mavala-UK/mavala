import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({params}: LoaderFunctionArgs) {
  const {locale} = params;
  return redirect(locale ? `/${locale}/account/orders` : '/account/orders');
}
