import {useRef, useEffect} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useProductViewDrawer} from '../ProductViewDrawer';
import {Search} from '~/components/icons/Search';
import {Text} from '~/components/ui/Text';
import styles from './DrawerSearch.module.css';

export function DrawerSearch() {
  const {formatMessage} = useIntl();
  const {
    searchValue,
    setSearchValue,
    setSelectedProducts,
    products,
    selectedProducts,
  } = useProductViewDrawer();

  const initialSelectedProducts = useRef(selectedProducts);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newSearchValue = event.target.value;
    setSearchValue(newSearchValue);

    if (newSearchValue.length === 0) {
      setSelectedProducts(initialSelectedProducts.current);
    } else {
      products.length && setSelectedProducts(products);
    }
  };

  useEffect(() => {
    if (searchValue.length === 0) {
      initialSelectedProducts.current = selectedProducts;
    }
  }, [searchValue, selectedProducts]);

  return (
    <div className={styles.root}>
      <Search />
      <Text asChild weight="light" size="sm">
        <input
          type="search"
          name="search"
          placeholder={formatMessage({
            id: 'search',
          })}
          value={searchValue}
          onChange={handleChange}
          className={styles.input}
        />
      </Text>
      {searchValue.length > 0 && (
        <Text asChild weight="light" size="xs">
          <button type="button" className={styles['cancel-button']}>
            <FormattedMessage id="cancel" />
          </button>
        </Text>
      )}
    </div>
  );
}
