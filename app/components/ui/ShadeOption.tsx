import * as RadioGroup from '@radix-ui/react-radio-group';
import type {VariantOption, VariantOptionValue} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {useProductViewDrawer} from '../product/drawer/ProductViewDrawer';
import ShadeCircle from './ShadeCircle';
import {Text} from './Text';
import styles from './ShadeOption.module.css';

export function ShadeOption({
  option,
  value,
}: {
  option: VariantOption;
  value: VariantOptionValue;
}) {
  const {isProductViewDrawerOpen} = useProductViewDrawer();
  const {title, tint} = (value?.variant as ProductVariantFragment) ?? {};

  return (
    <RadioGroup.Item
      value={JSON.stringify({name: option.name, value: value.value})}
      className={styles.button}
      data-variant={isProductViewDrawerOpen ? 'row' : 'column'}
    >
      <ShadeCircle
        tint={tint}
        size={isProductViewDrawerOpen ? 'lg' : 'xl'}
        className={styles.pattern}
      />
      <Text
        asChild
        className={styles.text}
        {...(isProductViewDrawerOpen ? {weight: 'light'} : {size: '4xs'})}
      >
        <span>
          {isProductViewDrawerOpen ? title : tint?.reference?.name?.value}
        </span>
      </Text>
    </RadioGroup.Item>
  );
}
