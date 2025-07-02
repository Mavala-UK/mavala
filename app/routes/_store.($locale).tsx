import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();

  for (const [key, value] of formData.entries()) {
    context.session.set(key, value);
  }

  return new Response(null);
}

/* Only one locale for the moment, no params locale, remove it when multiple locales back */
export async function loader({params}: LoaderFunctionArgs) {
  if (params.locale && params.locale.toLowerCase()) {
    // If the locale URL param is defined, yet we still are still at the default locale
    // then the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  return null;
}

/* Put it back when multiples params back */
// export async function loader({params, context}: LoaderFunctionArgs) {
//   const {language} = context.storefront.i18n;

//   if (params.locale && params.locale.toLowerCase() !== language.toLowerCase()) {
//     // If the locale URL param is defined, yet we still are still at the default locale
//     // then the the locale param must be invalid, send to the 404 page
//     throw new Response(null, {status: 404});
//   }

//   return null;
// }
