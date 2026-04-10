import {useCallback, useState} from 'react';
import {Text} from '../ui/Text';
import styles from './MarketingBar.module.css';

export function MarketingBar() {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleSignUp = useCallback(() => {
    const teaserBtn = document.querySelector<HTMLElement>(
      '#omnisend-form-68f20eea25bad2dc7481441e-teaser-btn',
    );
    if (teaserBtn) {
      teaserBtn.click();
    }
  }, []);

  if (isDismissed) return null;

  return (
    <div className={styles.root}>
      <Text size="xs" weight="medium" asChild>
        <p className={styles.content}>
          Get 10% OFF.{' '}
          <button
            type="button"
            className={styles.signup}
            onClick={handleSignUp}
          >
            Sign Up Now
          </button>
        </p>
      </Text>
      <button
        className={styles.close}
        type="button"
        aria-label="Close"
        onClick={() => setIsDismissed(true)}
      />
    </div>
  );
}
