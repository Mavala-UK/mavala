import { Outlet } from 'react-router';
import {type LinksFunction} from '@shopify/remix-oxygen';
import {ErrorMain} from '~/components/common/ErrorMain';
import {PageLayout} from '~/components/layout/PageLayout';
import ArchivoRegular from '/fonts/Archivo-Regular.woff2';
import ArchivoLight from '/fonts/Archivo-Light.woff2';
import ArchivoMedium from '/fonts/Archivo-Medium.woff2';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preload',
      as: 'font',
      href: ArchivoRegular,
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: ArchivoLight,
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: ArchivoMedium,
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.sanity.io',
    },
  ];
};

export default function Store() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}

export function ErrorBoundary() {
  return (
    <PageLayout>
      <ErrorMain />
    </PageLayout>
  );
}
