import {useProductView} from './ProductView';
import {Text} from '../ui/Text';
import styles from './ProductInfos.module.css';

export function ProductInfos() {
  const {product} = useProductView();
  const {description} = product ?? {};
  const reassurances = product?.reassurances?.references?.nodes;

  return (
    <div className={styles.root}>
      <Text weight="light" className={styles.text}>
        {description}
      </Text>
      {reassurances && (
        <ul className={styles.reassurances}>
          {reassurances?.map((reassurance) => {
            return (
              <li key={reassurance.id} className={styles.reassurance}>
                <Text weight="medium" className={styles['reassurance-text']}>
                  {reassurance.text?.value}
                </Text>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
