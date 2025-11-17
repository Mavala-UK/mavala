import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  const {cart, storefront} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return Response.json(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
      shop: {
        currency: cartResult?.cost?.totalAmount?.currencyCode,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const cart = await context.cart.get();

  return Response.json(cart);
}
