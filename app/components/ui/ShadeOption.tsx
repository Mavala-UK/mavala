import * as RadioGroup from '@radix-ui/react-radio-group';
import type {VariantOption, VariantOptionValue} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {useProductViewDrawer} from '../product/drawer/ProductViewDrawer';
import {Link} from '../common/Link';
import ShadeCircle from './ShadeCircle';
import {Text} from './Text';
import styles from './ShadeOption.module.css';

export function ShadeOption({
  option,
  value,
  to,
}: {
  option: VariantOption;
  value: VariantOptionValue;
  to?: string;
}) {
  const {isProductViewDrawerOpen} = useProductViewDrawer();
  const {title, tint} = (value?.variant as ProductVariantFragment) ?? {};
  const variant = isProductViewDrawerOpen ? 'row' : 'column';
  const label = isProductViewDrawerOpen ? title : tint?.reference?.name?.value;

  const content = (
    <>
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
        <span>{label}</span>
      </Text>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        replace
        preventScrollReset
        className={styles.button}
        data-variant={variant}
        data-active={value.isActive ? 'true' : undefined}
        aria-label={typeof label === 'string' ? label : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <RadioGroup.Item
      value={JSON.stringify({name: option.name, value: value.value})}
      className={styles.button}
      data-variant={variant}
    >
      {content}
    </RadioGroup.Item>
  );
}
