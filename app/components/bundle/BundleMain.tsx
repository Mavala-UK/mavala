import {useLoaderData, useParams, useSearchParams} from 'react-router';
import type {loader} from '~/routes/_store.($locale).products.$handle';
import {useProduct} from '~/hooks/useProduct';
import {Breadcrumb} from '../common/Breadcrumb';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import {Badges} from '../ui/Badges';
import {ProductMedias} from '../product/ProductMedias';
import {ProductView} from '../product/ProductView';
import {ProductAccordion} from '../product/ProductAccordion';
import {BundleProvider} from './BundleContext';
import {BundleComponentItem} from './BundleComponentItem';
import {BundleFeatures} from './BundleFeatures';
import {BundleAddToCart} from './BundleAddToCart';
import {ProductPrice} from '../product/ProductPrice';
import type {ProductItemFragment} from 'storefrontapi.generated';
import styles from './BundleMain.module.css';

export function BundleMain() {
  const {breadcrumbItems} = useLoaderData<typeof loader>();
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

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <BundleProvider bundleProduct={product}>
        {/* Wrap in ProductView so ProductMedias and ProductAccordion can read the bundle's own data */}
        <ProductView handle={product.handle} selectedOptions={selectedOptions}>
          <div className={styles.root}>
            <div className={styles.content}>
              <header className={styles.header}>
                <Badges items={product.badges} size="lg" />
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
                {product.description && (
                  <p className={styles.description}>{product.description}</p>
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
              <ProductAccordion />
            </div>

            <ProductMedias />
          </div>
        </ProductView>
      </BundleProvider>
    </>
  );
}
