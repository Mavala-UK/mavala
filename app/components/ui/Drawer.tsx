import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';
import {forwardRef, startTransition, useId} from 'react';
import {CloseButton} from './CloseButton';
import {cn} from '~/lib/utils';
import styles from './Drawer.module.css';

export const ANIMATION_DRAWER_DURATION = 500;

export const Drawer = ({
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof Root>) => {
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      startTransition(() => {
        onOpenChange(open);
      });
    }
  };

  return <Root onOpenChange={handleOpenChange} {...props} />;
};

export const DrawerContent = forwardRef<
  React.ComponentRef<typeof Content>,
  React.ComponentProps<typeof Content> & {
    animationOrigin?: 'top' | 'right' | 'bottom' | 'left';
  }
>(function DrawerContent(
  {
    className,
    onPointerDownOutside,
    animationOrigin = 'right',
    children,
    ...props
  },
  ref,
) {
  const id = useId();
  const overlayViewTransitionName = `overlay-${id.replaceAll(':', '')}`;
  const contentViewTransitionName = `content-${id.replaceAll(':', '')}`;

  const handlePointerDownOutside: React.ComponentProps<
    typeof Content
  >['onPointerDownOutside'] = (event) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.nodeName === 'HTML'
    ) {
      event.preventDefault();
      return;
    }

    onPointerDownOutside?.(event);
  };

  return (
    <>
      <style>{`
        ::view-transition-group(${overlayViewTransitionName}),
        ::view-transition-group(${contentViewTransitionName}) {
          z-index: 1;
        }
        :root {
          --animation-drawer-duration: ${ANIMATION_DRAWER_DURATION / 1000}s;
        }
      `}</style>
      <Portal>
        <Overlay
          className={styles.overlay}
          id={id}
          style={{viewTransitionName: overlayViewTransitionName}}
        />
        <Content
          className={cn(styles.content, className)}
          aria-describedby={undefined}
          data-animation-origin={animationOrigin}
          onPointerDownOutside={handlePointerDownOutside}
          style={{viewTransitionName: contentViewTransitionName}}
          ref={ref}
          {...props}
        >
          <div className={cn(styles.container, 'container-drawer')}>
            {children}
          </div>
        </Content>
      </Portal>
    </>
  );
});

export const DrawerHeader = forwardRef<
  React.ComponentRef<'header'>,
  React.ComponentProps<'header'>
>(function DrawerHeader({className, ...props}, ref) {
  return (
    <header className={cn(styles.header, className)} ref={ref} {...props} />
  );
});

export const DrawerBody = forwardRef<
  React.ComponentRef<'div'>,
  React.ComponentProps<'div'>
>(function DrawerBody({className, ...props}, ref) {
  return <div className={cn(styles.body, className)} ref={ref} {...props} />;
});

export const DrawerFooter = forwardRef<
  React.ComponentRef<'footer'>,
  React.ComponentProps<'footer'>
>(function DrawerFooter({className, ...props}, ref) {
  return (
    <footer className={cn(styles.footer, className)} ref={ref} {...props} />
  );
});

export const DrawerTitle = forwardRef<
  React.ComponentRef<typeof Title>,
  React.ComponentProps<typeof Title>
>(function DrawerTitle({className, ...props}, ref) {
  return <Title className={cn(styles.title, className)} ref={ref} {...props} />;
});

export const DrawerClose = forwardRef<
  React.ComponentRef<typeof Close>,
  React.ComponentProps<typeof Close>
>(function DrawerClose({className, ...props}, ref) {
  return (
    <Close className={cn(styles.close, className)} asChild ref={ref} {...props}>
      <CloseButton />
    </Close>
  );
});

export const DrawerDescription = Description;
export const DrawerTrigger = Trigger;
