import {
  Link as RemixLink,
  type LinkProps as RemixLinkProps,
} from 'react-router';
import {forwardRef} from 'react';
import {useMediaQuery} from '~/hooks/useMediaQuery';

export const Link = forwardRef<
  React.ComponentRef<typeof RemixLink>,
  RemixLinkProps
>(function Link({to, onClick, ...props}, ref) {
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (typeof to !== 'string' || event.button !== 0) return;

    const id = to.split('#')[1];
    const element = document.getElementById(id);

    if (!element) return;

    event.preventDefault();

    history.replaceState({}, '', to);
    element.tabIndex = -1;
    element.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
    element.focus({preventScroll: true});
  };

  return (
    <RemixLink
      to={to}
      prefetch="intent"
      viewTransition
      onClick={handleClick}
      ref={ref}
      {...props}
    />
  );
});
