import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import babel from 'vite-plugin-babel';

/**
 * Shim node:crypto for Cloudflare Workers / Oxygen runtime.
 *
 * uuid v13+ resolved to dist-node which imports node:crypto for
 * randomFillSync, randomUUID, createHash. Workers has globalThis.crypto
 * (Web Crypto API) which provides getRandomValues and randomUUID.
 * createHash is mapped via SubtleCrypto.digest.
 */
function nodeCryptoShimPlugin(): Plugin {
  const VIRTUAL_ID = '\0virtual:node-crypto';
  return {
    name: 'node-crypto-shim',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'node:crypto') {
        return VIRTUAL_ID;
      }
      return null;
    },
    load(id) {
      if (id === VIRTUAL_ID) {
        return `
var cr = globalThis.crypto || {};
var subtle = cr.subtle || {};
var enc = new TextEncoder();

function randomFillSync(buf, off, sz) {
  var bytes = cr.getRandomValues(new Uint8Array(sz || buf.byteLength - (off || 0)));
  if (off) buf.set(bytes, off); else buf.set(bytes);
  return buf;
}

function randomUUID() { return cr.randomUUID(); }

function createHash(algo) {
  var a = algo && algo.toLowerCase() === 'md5' ? 'MD5' : 'SHA-1';
  return { update: function(d) {
    var e = typeof d === 'string' ? enc.encode(d) : d;
    return { digest: function() {
      var r = subtle.digest(a, e);
      return r && typeof r.then === 'function' ? r.then(function(h) { return new Uint8Array(h); }) : new Uint8Array(r);
    }};
  }};
}

export { randomFillSync, randomUUID, createHash };
`;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    nodeCryptoShimPlugin(),
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
    // Force-bundle uuid to prevent Vite from auto-externalizing its node:crypto
    // import (uuid v13+ dist-node imports node:crypto).
    noExternal: ['uuid'],
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
