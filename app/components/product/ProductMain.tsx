import {use, Suspense} from 'react';
import {
  useLoaderData,
  useParams,
  useRouteLoaderData,
  useSearchParams,
} from 'react-router';
import {RootLoader} from '~/root';
import {Analytics} from '@shopify/hydrogen';
import type {loader} from '~/routes/_store.($locale).products.$handle';
import {useProduct} from '~/hooks/useProduct';
import {Breadcrumb} from '../common/Breadcrumb';
import {ProductView} from './ProductView';
import {ProductHeader} from './ProductHeader';
import {ProductInfos} from './ProductInfos';
import {ProductForm} from './ProductForm';
import {ProductMedias} from './ProductMedias';
import {StoreAvailability} from './StoreAvailability';
import {CompleteYourOrder} from '../ui/CompleteYourOrder';
import {ProductAccordion} from './ProductAccordion';
import {ProductReviews} from './ProductReviews';
import {VideoSection} from './VideoSection';
import {RelatedProducts} from './RelatedProducts';
import {FaqSection} from '../common/FaqSection';
import {FeaturedArticles} from '../blog/FeaturedArticles';
import styles from './ProductMain.module.css';

export function ProductMain() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {isMavalaCorporate, isMavalaFrance} = data?.sites ?? {};
  const {
    breadcrumbItems,
    relatedProducts,
    faqSection,
    relatedArticles: relatedArticlesPromise,
  } = useLoaderData<typeof loader>();
  const {handle} = useParams();
  const [searchParams] = useSearchParams();

  const selectedOptions = Array.from(searchParams.entries()).map(
    ([name, value]) => ({name, value}),
  );

  const {data: product} = useProduct(handle ?? '', selectedOptions);
  if (!product) {
    return null;
  }

  const {selectedVariant, videoSection} = product ?? {};

  // "Bundle Up & Save" is driven by the complementaryProducts metafield.
  // PROPOSAL (needs design sign-off): when a product has no complementaryProducts
  // but DOES have bundle-membership data (the bundle_components metafield Carrie
  // fills on bundle products), fall back to those components so the cross-sell
  // strip shows without maintaining a parallel complementaryProducts field.
  // The product itself is excluded because a bundle lists itself among its own
  // components (e.g. 930-double-brow's bundle_components includes 930-double-brow).
  const complementaryNodes = product?.complementaryProducts?.references?.nodes;
  const bundleUpProducts =
    complementaryNodes && complementaryNodes.length > 0
      ? complementaryNodes
      : (product?.bundleComponents?.references?.nodes ?? []).filter(
          (node) => node.handle !== product.handle,
        );

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <ProductView handle={product.handle} selectedOptions={selectedOptions}>
        <div className={styles.root}>
          <div className={styles.content}>
            <ProductHeader />
            <div className={styles.bloc}>
              <ProductForm />
              {!isMavalaCorporate && (
                <>
                  <StoreAvailability />
                  <CompleteYourOrder
                    products={bundleUpProducts}
                    title="Bundle Up & Save"
                  />
                </>
              )}
            </div>
            <ProductInfos />
            <ProductAccordion className={styles.accordions} />
          </div>
          <ProductMedias />
        </div>
      </ProductView>
      {videoSection && <VideoSection content={videoSection?.reference!} />}
      {!isMavalaCorporate && <ProductReviews product={product} />}
      <Suspense fallback={null}>
        <RelatedProductsLoader relatedProductsPromise={relatedProducts} />
      </Suspense>
      <FaqSection data={faqSection} />
      {isMavalaFrance && (
        <Suspense>
          <FeaturedArticlesLoader
            relatedArticlesPromise={relatedArticlesPromise}
          />
        </Suspense>
      )}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              category: product.productType,
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}

function RelatedProductsLoader({
  relatedProductsPromise,
}: {
  relatedProductsPromise: Promise<any>;
}) {
  const {productRecommendations} = use(relatedProductsPromise);
  return <RelatedProducts products={(productRecommendations as any[]) ?? []} />;
}

function FeaturedArticlesLoader({
  relatedArticlesPromise,
}: {
  relatedArticlesPromise: Promise<any>;
}) {
  const {relatedArticles} = use(relatedArticlesPromise).data ?? {};
  return <FeaturedArticles relatedArticles={relatedArticles} />;
}
