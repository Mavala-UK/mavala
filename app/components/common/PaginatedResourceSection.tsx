import {Pagination} from '@shopify/hydrogen';
import {Button} from '../ui/Button';
import {FormattedMessage} from 'react-intl';
import {cn} from '~/lib/utils';
import styles from './PaginatedResourceSection.module.css';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */

export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  className,
  tag: Component = 'div',
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  className?: string;
  tag?: React.ElementType;
}) {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const isDisabled =
      event.currentTarget.getAttribute('aria-disabled') === 'true';

    if (isDisabled) {
      event.preventDefault();
    }
  };

  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => (
        <div className={cn(styles.root, className)}>
          <Button
            theme="light"
            className={styles.button}
            aria-busy={isLoading}
            aria-disabled={isLoading}
            onClick={handleClick}
            asChild
            suppressHydrationWarning
          >
            <PreviousLink>
              <FormattedMessage id="load_previous" />
            </PreviousLink>
          </Button>
          <Component>
            {nodes.map((node, index) => children({node, index}))}
          </Component>
          <Button
            theme="light"
            className={styles.button}
            aria-busy={isLoading}
            aria-disabled={isLoading}
            onClick={handleClick}
            asChild
            suppressHydrationWarning
          >
            <NextLink>
              <FormattedMessage id="load_more" />
            </NextLink>
          </Button>
        </div>
      )}
    </Pagination>
  );
}
