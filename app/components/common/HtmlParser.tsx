import type {DOMNode, HTMLReactParserOptions} from 'html-react-parser';
import parse, {domToReact} from 'html-react-parser';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import {TextContainer} from '../ui/TextContainer';
import {Link} from '../ui/Link';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';

export function HtmlParser({
  html,
  ...props
}: React.ComponentPropsWithoutRef<typeof TextContainer> & {html: string}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  const replace: HTMLReactParserOptions['replace'] = (domNode) => {
    if (domNode.type !== 'tag') {
      return;
    }

    switch (domNode.name) {
      case 'p':
        return (
          <Text size={isDesktop ? 'md' : 'sm'} weight="light">
            {domToReact(domNode.children as DOMNode[], {replace})}
          </Text>
        );

      case 'a':
        return (
          <Link variant="animated-underline-reverse" to={domNode.attribs?.href}>
            {domToReact(domNode.children as DOMNode[], {replace})}
          </Link>
        );

      case 'h1':
        return (
          <Heading size={isDesktop ? '3xl' : 'xl'} asChild>
            <h1>{domToReact(domNode.children as DOMNode[], {replace})}</h1>
          </Heading>
        );

      case 'h2':
        return (
          <Heading size={isDesktop ? '2xl' : 'lg'}>
            {domToReact(domNode.children as DOMNode[], {replace})}
          </Heading>
        );

      case 'h3':
        return (
          <Heading size={isDesktop ? 'lg' : 'md'} asChild>
            <h3>{domToReact(domNode.children as DOMNode[], {replace})}</h3>
          </Heading>
        );

      case 'h4':
        return (
          <Heading size={isDesktop ? 'md' : 'sm'} asChild>
            <h4>{domToReact(domNode.children as DOMNode[], {replace})}</h4>
          </Heading>
        );

      case 'h5':
        return (
          <Heading size={isDesktop ? 'sm' : 'xs'} asChild>
            <h5>{domToReact(domNode.children as DOMNode[], {replace})}</h5>
          </Heading>
        );

      case 'h6':
        return (
          <Heading size={'xs'} asChild>
            <h6>{domToReact(domNode.children as DOMNode[], {replace})}</h6>
          </Heading>
        );

      case 'table':
        return (
          <Table>{domToReact(domNode.children as DOMNode[], {replace})}</Table>
        );

      case 'thead':
        return (
          <TableHead>
            {domToReact(domNode.children as DOMNode[], {replace})}
          </TableHead>
        );

      case 'tbody':
        return (
          <TableBody>
            {domToReact(domNode.children as DOMNode[], {replace})}
          </TableBody>
        );

      case 'tr':
        return (
          <TableRow>
            {domToReact(domNode.children as DOMNode[], {replace})}
          </TableRow>
        );

      case 'th':
        return (
          <TableHeader>
            {domToReact(domNode.children as DOMNode[], {replace})}
          </TableHeader>
        );

      case 'td':
        return (
          <TableCell>
            {domToReact(domNode.children as DOMNode[], {replace})}
          </TableCell>
        );

      default:
        return;
    }
  };

  return <TextContainer {...props}>{parse(html, {replace})}</TextContainer>;
}
