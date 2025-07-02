import {useMediaQuery} from '~/hooks/useMediaQuery';
import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import {RichText as RichTextComponent} from '@shopify/hydrogen';
import {Heading} from '../ui/Heading';
import {Link} from '../ui/Link';
import {Text} from '../ui/Text';
import {TextContainer} from '../ui/TextContainer';

export function RichText({
  data,
  ...props
}: React.ComponentPropsWithoutRef<typeof TextContainer> &
  Pick<React.ComponentPropsWithoutRef<typeof RichTextComponent>, 'data'>) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {pathPrefix} = rootData?.selectedLocale ?? {};

  const components = {
    root: ({node}) => {
      return node.children;
    },
    link: ({node}) => (
      <Link
        to={`${pathPrefix}${node?.url}`}
        target={node.target}
        title={node.title}
        variant="animated-underline-reverse"
        size="sm"
        color="grayed"
      >
        {node.children}
      </Link>
    ),
    heading: ({node}) => {
      const Component = `h${node.level}` as React.ElementType;

      switch (node.level) {
        case 1:
          return (
            <Heading size={isDesktop ? '3xl' : 'xl'} asChild>
              <Component>{node.children}</Component>
            </Heading>
          );

        case 2:
          return (
            <Heading size={isDesktop ? '2xl' : 'lg'}>{node.children}</Heading>
          );

        case 3:
          return (
            <Heading size={isDesktop ? 'lg' : 'md'} asChild>
              <Component>{node.children}</Component>
            </Heading>
          );

        case 4:
          return (
            <Heading size={isDesktop ? 'md' : 'sm'} asChild>
              <Component>{node.children}</Component>
            </Heading>
          );

        case 5:
          return (
            <Heading size={isDesktop ? 'sm' : 'xs'} asChild>
              <Component>{node.children}</Component>
            </Heading>
          );

        case 6:
          return (
            <Heading size={'xs'} asChild>
              <Component>{node.children}</Component>
            </Heading>
          );

        default:
          return (
            <Text size={isDesktop ? 'md' : 'sm'} weight="light">
              {node.children}
            </Text>
          );
      }
    },
  } satisfies React.ComponentProps<typeof RichTextComponent>['components'];

  return (
    <RichTextComponent
      as={TextContainer}
      data={data}
      components={components}
      {...props}
    />
  );
}
