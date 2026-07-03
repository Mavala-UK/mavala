import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router';

export async function loader({params}: LoaderFunctionArgs) {
  const {locale} = params;
  return redirect(locale ? `/${locale}` : '/');
}

export async function action({context}: ActionFunctionArgs) {
  return context.customerAccount.logout();
}
