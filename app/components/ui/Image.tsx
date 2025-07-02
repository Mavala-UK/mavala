import {useState, forwardRef, useEffect} from 'react';
import {Image as HydrogenImage} from '@shopify/hydrogen';
import styles from './Image.module.css';

export const Image = forwardRef<
  React.ComponentRef<typeof HydrogenImage>,
  React.ComponentProps<typeof HydrogenImage>
>(function Image({className, ...props}, ref) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    !loaded && setLoaded(true);
  }, [loaded]);

  return (
    <span className={styles.root} data-loaded={loaded}>
      <HydrogenImage
        className={className}
        ref={ref}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </span>
  );
});
