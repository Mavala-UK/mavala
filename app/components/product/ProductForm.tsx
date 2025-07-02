import {cn} from '~/lib/utils';
import { useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';
import {useProductView} from './ProductView';
import {ProductVariants} from './ProductVariants';
import {ProductColors} from './ProductColors';
import {AddToCartButton} from '../cart/AddToCartButton';
import styles from './ProductForm.module.css';

export function ProductForm() {
  const data = useRouteLoaderData<RootLoader>('root');
  const {isMavalaCorporate} = data?.sites ?? {};
  const {selectedVariant} = useProductView();

  return (
    <div className={styles.root}>
      <ProductColors className={cn(styles.options, styles.colors)} />
      <ProductVariants className={styles.options} />
      {!isMavalaCorporate && (
        <AddToCartButton
          className={styles.button}
          selectedVariant={selectedVariant!}
        />
      )}
    </div>
  );
}
