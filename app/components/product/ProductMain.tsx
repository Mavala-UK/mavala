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
  const {relatedArticles} = use(relatedArticlesPromise).data ?? {};
  const {productRecommendations} = use(relatedProducts);
  const {handle} = useParams();
  const [searchParams] = useSearchParams();

  const selectedOptions = Array.from(searchParams.entries()).map(
    ([name, value]) => ({name, value}),
  );

  const {data: product} = useProduct(handle ?? '', selectedOptions);
  console.log(product);

  if (!product) {
    return null;
  }

  const {selectedVariant, videoSection} = product ?? {};

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
                    products={
                      product?.complementaryProducts?.references?.nodes!
                    }
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
      <RelatedProducts products={productRecommendations ?? []} />
      <FaqSection data={faqSection} />
      {isMavalaFrance && (
        <Suspense>
          <FeaturedArticles relatedArticles={relatedArticles} />
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
