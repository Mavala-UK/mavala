import path from 'path';
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import babel from 'vite-plugin-babel';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ['@babel/preset-typescript'],
        plugins: [['babel-plugin-react-compiler']],
        compact: true,
      },
    }),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return;
        }

        defaultHandler(warning);
      },
      external: ['react-router-dom', 'react-router-dom/server'],
    },
    ssrManifest: true,
  },
  resolve: {
    alias: {
      '@sanity/visual-editing/remix': '@sanity/visual-editing/react-router',
      'html-dom-parser': 'html-dom-parser/lib/server/html-to-dom',
      'react-dom/server': 'react-dom/server.edge',
      '@sanity/react-loader': path.resolve(
        __dirname,
        'node_modules/@sanity/react-loader/dist/index.js',
      ),
    },
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: [
        'rxjs',
        'react-compiler-runtime',
        '@mapbox/mapbox-gl-geocoder',
        '@sanity/icons',
        '@sanity/image-url',
        '@sanity/client',
        'react',
        'react/compiler-runtime',
        'react-intl',
        'html-react-parser',
        '@formspree/react',
      ],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
