import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// /pages/blog has a vestigial Sanity page document with no resolving Hydrogen
// route (the blog lives at /blog). This dedicated route file outscores both
// _store.($locale).pages.$handle.tsx (dynamic $handle) and
// _store.($locale).blog._index.tsx (dynamic $locale) because it has two static
// segments (pages + blog), so React Router v7 matches /pages/blog here first.
export async function loader(_args: LoaderFunctionArgs) {
  return redirect('/blog', {status: 301});
}

// The loader always redirects; this component never renders.
// A default export is required by React Router v7 fs-routes.
export default function PagesBlogRedirect() {
  return null;
}
