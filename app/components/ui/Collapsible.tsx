import {useEffect, useState, forwardRef, useCallback} from 'react';
import {Root, Trigger, Content} from '@radix-ui/react-collapsible';
import { useLocation } from 'react-router';
import {cn} from '~/lib/utils';
import type {CollectionMenuFragment} from 'storefrontapi.generated';
import styles from './Collapsible.module.css';

export function Collapsible({
  className,
  triggerRef,
  contentRef,
  onSectionChange = () => {},
  children,
}: {
  className?: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  onSectionChange?: React.Dispatch<
    React.SetStateAction<CollectionMenuFragment | null>
  >;
  children: React.ReactElement<
    typeof CollapsibleTrigger | typeof CollapsibleContent
  >[];
}) {
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const {pathname, search} = useLocation();

  const handleMenuChange = useCallback(
    (open: boolean) => {
      setIsSectionOpen(open);
      open && onSectionChange(null);
    },
    [onSectionChange],
  );

  useEffect(() => {
    setIsSectionOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        !triggerRef.current?.contains(event.target as Node) &&
        !contentRef.current?.contains(event.target as Node)
      ) {
        handleMenuChange(false);
      }
    };

    if (isSectionOpen) {
      document.addEventListener('click', handleClick, true);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.body.style.overflow = '';
    };
  }, [isSectionOpen, triggerRef, contentRef, handleMenuChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleMenuChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleMenuChange]);

  return (
    <Root
      open={isSectionOpen}
      onOpenChange={handleMenuChange}
      className={cn(styles['collapsible-root'], className)}
    >
      {children}
      <div className={styles.overlay} />
    </Root>
  );
}

/* TRIGGER */
export const CollapsibleTrigger = forwardRef<
  React.ComponentRef<typeof Trigger>,
  React.ComponentProps<typeof Trigger>
>(function CollapsibleTrigger({children, ...props}, ref) {
  return (
    <Trigger
      type="button"
      ref={ref}
      className={styles['collapsible-trigger']}
      {...props}
    >
      {children}
    </Trigger>
  );
});

/* CONTENT */
export const CollapsibleContent = forwardRef<
  React.ComponentRef<typeof Content>,
  React.ComponentProps<typeof Content>
>(function CollapsibleContent({children, ...props}, ref) {
  return (
    <Content ref={ref} className={styles['collapsible-content']} {...props}>
      {children}
    </Content>
  );
});
