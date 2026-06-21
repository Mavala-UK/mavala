import {useCallback, useEffect, useState} from 'react';
import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';
import {Link} from '../ui/Link';
import {Text} from '../ui/Text';
import styles from './MarketingBar.module.css';

const ROTATE_INTERVAL_MS = 5000;

export function MarketingBar() {
  const data = useRouteLoaderData<RootLoader>('root');
  // Editable promo slot, set by the store owner on the `global` metaobject in
  // Shopify Admin. When the text is empty we fall back to the original
  // "Get 10% OFF. Sign Up Now" message so the bar never breaks.
  const promoText = data?.global?.marketingBarText?.value?.trim() || '';
  const promoLink = data?.global?.marketingBarLink?.value?.trim() || '';

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
              <PromoMessage
                text={promoText}
                link={promoLink}
                onSignUp={handleSignUp}
              />
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

function PromoMessage({
  text,
  link,
  onSignUp,
}: {
  text: string;
  link: string;
  onSignUp: () => void;
}) {
  // Owner has set custom text and a link: the whole line is clickable.
  if (text && link) {
    return (
      <Link className={styles.signup} to={link}>
        {text}
      </Link>
    );
  }

  // Owner has set custom text but no link: plain text.
  if (text) {
    return <>{text}</>;
  }

  // No custom text set: keep the original sign-up promo with the Omnisend teaser.
  return (
    <>
      Get 10% OFF.{' '}
      <button type="button" className={styles.signup} onClick={onSignUp}>
        Sign Up Now
      </button>
    </>
  );
}
