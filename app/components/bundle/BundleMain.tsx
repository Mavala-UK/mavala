import {use, Suspense} from 'react';
import {
  useLoaderData,
  useParams,
  useRouteLoaderData,
  useSearchParams,
} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import {RootLoader} from '~/root';
import type {loader} from '~/routes/_store.($locale).products.$handle';
import {useProduct} from '~/hooks/useProduct';
import {Breadcrumb} from '../common/Breadcrumb';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {Badges} from '../ui/Badges';
import {ProductMedias} from '../product/ProductMedias';
import {ProductView} from '../product/ProductView';
import {ProductInfos} from '../product/ProductInfos';
import {ProductAccordion} from '../product/ProductAccordion';
import {ProductReviews} from '../product/ProductReviews';
import {StoreAvailability} from '../product/StoreAvailability';
import {VideoSection} from '../product/VideoSection';
import {RelatedProducts} from '../product/RelatedProducts';
import {CompleteYourOrder} from '../ui/CompleteYourOrder';
import {FaqSection} from '../common/FaqSection';
import {FeaturedArticles} from '../blog/FeaturedArticles';
import {BundleProvider} from './BundleContext';
import {BundleComponentItem} from './BundleComponentItem';
import {BundleFeatures} from './BundleFeatures';
import {BundleAddToCart} from './BundleAddToCart';
import {ProductPrice} from '../product/ProductPrice';
import type {ProductItemFragment} from 'storefrontapi.generated';
import styles from './BundleMain.module.css';

export function BundleMain() {
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

  if (!product) return null;

  const components =
    ((product as any).bundleComponents?.references?.nodes as ProductItemFragment[]) ??
    [];

  const bundleVariant =
    product.selectedVariant ?? product.variants.nodes[0] ?? null;

  const {videoSection} = product;

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <BundleProvider bundleProduct={product}>
        {/* Wrap in ProductView so ProductMedias and ProductAccordion can read the bundle's own data */}
        <ProductView handle={product.handle} selectedOptions={selectedOptions}>
          <div className={styles.root}>
            <div className={styles.content}>
              <header className={styles.header}>
                <Heading asChild size="xl">
                  <h1>{product.title}</h1>
                </Heading>
                {product.productType && (
                  <Text size="sm" className={styles.productType}>
                    {product.productType}
                  </Text>
                )}
                {bundleVariant && (
                  <ProductPrice
                    price={bundleVariant.price}
                    compareAtPrice={bundleVariant.compareAtPrice}
                  />
                )}
              </header>

              <BundleFeatures
                title={product.featuresTitle?.value}
                features={product.features}
              />

              <div className={styles.components}>
                {components.map((component) => (
                  <BundleComponentItem
                    key={component.handle}
                    component={component}
                  />
                ))}
              </div>

              <BundleAddToCart components={components} />

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

              <ProductInfos />
              <ProductAccordion />
            </div>

            <ProductMedias />
            <Badges
              items={product.badges}
              size="lg"
              variant="outline"
              className={styles['gallery-badges']}
            />
          </div>
        </ProductView>
      </BundleProvider>
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
              price: bundleVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: bundleVariant?.id || '',
              variantTitle: bundleVariant?.title || '',
              category: product.productType,
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}
