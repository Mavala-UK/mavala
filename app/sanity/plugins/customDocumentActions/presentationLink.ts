import {EyeOpenIcon} from '@sanity/icons';
import {
  type DocumentActionProps,
  type DocumentActionDescription,
  useClient,
} from 'sanity';
import {useRouter} from 'sanity/router';
import type {
  // Article,
  // ArticleCategory,
  Collection,
  Page,
  Product,
} from 'sanity.generated';
// import {SANITY_API_VERSION} from '~/sanity/constants';

export default ({
  draft,
  published,
  type,
}: DocumentActionProps): DocumentActionDescription | undefined => {
  const {navigateUrl} = useRouter();
  // const client = useClient({apiVersion: SANITY_API_VERSION});
  const document = draft ?? published;

  if (
    ![
      'home',
      'page',
      'articleCategory',
      'article',
      'product',
      'collection',
    ].includes(type)
  ) {
    return;
  }

  const onHandle = async () => {
    let previewUrl: string | null = null;

    switch (type) {
      case 'home': {
        previewUrl = '/';
        break;
      }

      case 'page': {
        const page = document as Page;

        previewUrl = `/pages/${page?.slug?.current}`;
        break;
      }

      case 'product': {
        const product = document as Product;

        previewUrl = `/products/${product?.store?.slug?.current}`;
        break;
      }

      case 'collection': {
        const collection = document as Collection;

        previewUrl = `/collections/${collection?.store?.slug?.current}`;
        break;
      }
    }

    navigateUrl({path: `/studio/presentation/?preview=${previewUrl}`});
  };

  return {
    label: 'Ouvrir dans Presentation',
    icon: EyeOpenIcon,
    onHandle,
    shortcut: 'Ctrl+Alt+P',
  };
};
