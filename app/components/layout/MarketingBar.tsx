import {useCallback, useEffect, useState} from 'react';
import {Text} from '../ui/Text';
import styles from './MarketingBar.module.css';

const ROTATE_INTERVAL_MS = 5000;

export function MarketingBar() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSignUp = useCallback(() => {
    const teaserBtn = document.querySelector<HTMLElement>(
      '#omnisend-form-68f20eea25bad2dc7481441e-teaser-btn',
    );
    if (teaserBtn) {
      teaserBtn.click();
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % 2);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  if (isDismissed) return null;

  return (
    <div className={styles.root}>
      <span aria-live="polite" aria-atomic="true" className={styles.messageRegion}>
        <Text size="xs" weight="medium" asChild>
          <p className={styles.content} key={activeIndex}>
            {activeIndex === 0 ? (
              <>
                Get 10% OFF.{' '}
                <button
                  type="button"
                  className={styles.signup}
                  onClick={handleSignUp}
                >
                  Sign Up Now
                </button>
              </>
            ) : (
              <>Free delivery on orders over £49.99</>
            )}
          </p>
        </Text>
      </span>
      <button
        className={styles.close}
        type="button"
        aria-label="Close"
        onClick={() => setIsDismissed(true)}
      />
    </div>
  );
}
