/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {HydrogenSessionData, HydrogenEnv} from '@shopify/hydrogen';
import type {createAppLoadContext} from '~/lib/context';

declare global {
  interface Env extends HydrogenEnv {
    SANITY_PROJECT_ID: string;
    SANITY_DATASET?: string;
    SANITY_API_VERSION?: string;
    SANITY_API_TOKEN?: string;
    PRIVATE_ADMIN_API_TOKEN?: string;
    PRIVATE_YOTPO_APP_KEY?: string;
    MAPBOX_ACCESS_TOKEN?: string;
  }

  interface Window {
    [ENVIRONMENT]: {
      preview: {
        domain?: string;
        secret: string;
      };
      shopify: {
        storeDomain: string;
      };
    };
    SITES: {
      isMavalaFrance: boolean;
      isMavalaCorporate: boolean;
    };
    SANITY: {
      projectId: string;
      dataset: string;
      preview: boolean;
      apiVersion: string;
    };
    dataLayer: {
      event: string;
      [key: string]: unknown;
    }[];
    _axcb?: Array<
      (sdk: {
        on(event: 'ready', callback: () => void): void;
        on(
          event: 'cookies:complete',
          callback: (choices: Record<string, boolean>) => void,
        ): void;
      }) => void
    >;
    openAxeptioCookies?: () => void;
  }

  namespace NodeJS {
    interface ProcessEnv extends Env {
      NODE_ENV: 'production' | 'development';
    }
  }
}

declare module 'react-router' {
  interface AppLoadContext
    extends Awaited<ReturnType<typeof createAppLoadContext>> {
    // to change context type, change the return of createAppLoadContext() instead
  }

  // TODO: remove this once we've migrated to `Route.LoaderArgs` for our loaders
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }

  // TODO: remove this once we've migrated to `Route.ActionArgs` for our actions
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }

  interface SessionData extends HydrogenSessionData {
    // declare local additions to the Remix session data here
  }
}
