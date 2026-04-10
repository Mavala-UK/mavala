import {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router';
import {HeaderMain} from './HeaderMain';
import {AnnouncementBar} from './AnnouncementBar';
import {MarketingBar} from './MarketingBar';
import styles from './Header.module.css';

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(true);
  const {pathname} = useLocation();

  useEffect(() => {
    let scrollValue = 0;

    const handleScroll = () => {
      if (!ref.current) return;
      const hasScrolledDown = window.scrollY > scrollValue;
      const hasScrolledPast = window.scrollY > ref.current.scrollHeight;

      setIsCollapsed(hasScrolledDown && hasScrolledPast);
      setHasScrolled(!hasScrolledPast);

      scrollValue = window.scrollY;
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return (
    <>
      <MarketingBar />
      <AnnouncementBar />
      <header className={styles.root} data-collapsed={isCollapsed} ref={ref}>
        <HeaderMain scrolled={hasScrolled} />
      </header>
    </>
  );
}
