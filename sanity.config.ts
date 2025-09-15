import {visionTool} from '@sanity/vision';
import {defineConfig, isDev, type PluginOptions} from 'sanity';
import {structureTool} from 'sanity/structure';
import {media, mediaAssetSource} from 'sanity-plugin-media';
import {presentationTool} from 'sanity/presentation';
import {Navbar} from './app/sanity/components/Navbar';
import {customDocumentActions} from './app/sanity/plugins/customDocumentActions';
import {schemaTypes} from './app/sanity/schemaTypes';
import {structure} from './app/sanity/structure';
import {Logo} from '~/sanity/components/Logo';
import {internationalizedArray} from 'sanity-plugin-internationalized-array';
import {SITES, SANITY, LANGUAGES} from './app/sanity/constants';
import {mainDocuments} from '~/sanity/mainDocuments';

const projectId = globalThis.process?.env.SANITY_PROJECT_ID as string;
const dataset = globalThis.process?.env.SANITY_DATASET;

export default defineConfig({
  name: 'default',
  title: 'Mavala UK',
  projectId: SANITY?.projectId ?? projectId,
  dataset: SANITY?.dataset ?? dataset ?? 'production',
  plugins: [
    structureTool({structure}),
    customDocumentActions(),
    media() as PluginOptions,
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/preview',
        },
      },
      resolve: {mainDocuments},
    }),
    internationalizedArray({
      languages: [{id: 'en', title: 'English'}],
      defaultLanguages: ['en'],
      fieldTypes: [
        'file',
        'image',
        'imageWithAltText',
        'portableText',
        'portableTextEditorial',
        'portableTextArticle',
        'string',
        'text',
      ],
    }),
    ...(isDev ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
  },
  form: {
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource !== mediaAssetSource,
        );
      },
    },
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource === mediaAssetSource,
        );
      },
    },
  },
  studio: {
    components: {
      navbar: Navbar,
    },
  },
  icon: Logo,
});
