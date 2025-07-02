import {DialogClose} from '@radix-ui/react-dialog';
import {FormattedMessage} from 'react-intl';
import {
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
} from '../ui/Drawer';
import {Button, ButtonEffect} from '../ui/Button';
import {Text} from '../ui/Text';
import {ProductCard} from '../product/ProductCard';
import styles from './GiftDrawer.module.css';
import {useCartDrawer} from './CartDrawer';
import {useCollectionItem} from '~/hooks/useCollectionItem';
import {useDiscounts} from './DiscountsView';
import {Collection} from 'admin.types';

export function DrawerGiftTrigger({
  collection,
  className,
}: {
  collection: Collection;
  className?: string;
}) {
  const {setIsGiftDrawerOpen, setSelectedGiftCollection} = useDiscounts();
  const {setIsCartDrawerOpen} = useCartDrawer();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setIsGiftDrawerOpen(true);
    setIsCartDrawerOpen(false);
    setSelectedGiftCollection(collection);
  };

  return (
    <Button
      size="4xs"
      theme="grayed"
      className={className}
      onClick={handleClick}
    >
      <ButtonEffect>
        <FormattedMessage id="choose" />
      </ButtonEffect>
    </Button>
  );
}

export function GiftDrawer() {
  const {selectedGiftCollection} = useDiscounts();

  if (!selectedGiftCollection) return null;

  const {data: collection} = useCollectionItem(selectedGiftCollection?.handle, {
    first: 50,
    priceMin: 0.0,
  });
  const products = collection?.products?.nodes ?? [];

  if (!products) return null;

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle asChild>
          <Text size="sm" asChild>
            <h2>
              <FormattedMessage id="select_product" />
            </h2>
          </Text>
        </DrawerTitle>
        <DrawerClose />
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.products}>
          {products?.map((product) => (
            <ProductCard
              variant="strip"
              key={product.id}
              initialData={product}
              handle={product.handle}
              size="sm"
            />
          ))}
        </div>
      </DrawerBody>
      <DrawerFooter>
        <DialogClose asChild>
          <Button>
            <ButtonEffect>
              <FormattedMessage id="back_to_cart" />
            </ButtonEffect>
          </Button>
        </DialogClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
