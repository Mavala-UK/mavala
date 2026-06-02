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
import {useCallback, useEffect, useMemo, useState} from 'react';
import {BundleProvider, useBundleContext} from './BundleContext';
import {BundleComponentItem} from './BundleComponentItem';
import {BundleFeatures} from './BundleFeatures';
import {BundleAddToCart} from './BundleAddToCart';
import {BundleFreeItems} from './BundleFreeItems';
import {ProductPrice} from '../product/ProductPrice';
import {Accordion} from '../ui/Accordion';
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

              <ProductInfos />

              <BundleFeatures
                title={product.featuresTitle?.value}
                features={product.features}
              />

              <BundleFreeItems
                items={
                  ((product as any).freeItems?.references?.nodes as any[]) ?? []
                }
              />

              <BundleComponentsPicker components={components} />

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

              <ProductAccordion />
            </div>

            <ProductMedias />
            <Badges
              data-testid="bundle-badges-overlay"
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

function BundleComponentsPicker({
  components,
}: {
  components: ProductItemFragment[];
}) {
  const {selectedVariants} = useBundleContext();

  // Active component: first unselected one, or null if all selected
  const activeHandle = useMemo(() => {
    for (const c of components) {
      if (!selectedVariants[c.handle]) return c.handle;
    }
    return null;
  }, [components, selectedVariants]);

  // When the user clicks a previously-selected component to re-edit,
  // we override the auto-advance and open that specific item. Once
  // selections change, we reset back to auto-advance mode.
  const [explicitOpenHandle, setExplicitOpenHandle] = useState<string | null>(
    null,
  );

  // Red prompt: turns true when user clicks a locked (not-yet-reached)
  // component out of band. Resets to false on any valid selection.
  const [outOfBandError, setOutOfBandError] = useState(false);

  useEffect(() => {
    setExplicitOpenHandle(null);
    setOutOfBandError(false);
  }, [selectedVariants]);

  const handleValueChange = useCallback(
    (value: string) => {
      if (value && selectedVariants[value]) {
        setExplicitOpenHandle(value);      // re-edit a chosen one
        setOutOfBandError(false);
      } else if (value && value !== activeHandle) {
        setOutOfBandError(true);           // clicked a locked future component
        if (activeHandle) {
          const prefersReducedMotion =
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
          document
            .getElementById(`bundle-component-${activeHandle}`)
            ?.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'center',
            });
        }
      } else {
        setExplicitOpenHandle(null);
        setOutOfBandError(false);
      }
    },
    [selectedVariants, activeHandle],
  );

  const accordionValue = explicitOpenHandle ?? activeHandle ?? '';

  return (
    <>
      {activeHandle !== null && (
        <Text size="sm" className={outOfBandError ? styles.shadePromptError : styles.shadePrompt}>
          Choose your shade
        </Text>
      )}
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={handleValueChange}
        className={styles.components}
      >
      {components.map((component, index) => {
        const isSelected = !!selectedVariants[component.handle];
        const isActive = activeHandle === component.handle;
        return (
          <BundleComponentItem
            key={component.handle}
            component={component}
            isActive={isActive}
            isSelected={isSelected}
            isAnySelected={activeHandle === null}
            index={index}
          />
        );
      })}
    </Accordion>
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
