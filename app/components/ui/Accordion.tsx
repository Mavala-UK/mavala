import {Content, Header, Item, Root, Trigger} from '@radix-ui/react-accordion';
import {startTransition} from 'react';
import {cn} from '~/lib/utils';
import styles from './Accordion.module.css';

export function Accordion({
  onValueChange,
  ...props
}: React.ComponentProps<typeof Root>) {
  const handleValueChange = (value: string & string[]) => {
    if (onValueChange) {
      startTransition(() => {
        onValueChange(value);
      });
    }
  };

  return <Root onValueChange={handleValueChange} {...props} />;
}

export function AccordionContent({
  className,
  ref,
  children,
  ...props
}: React.ComponentProps<typeof Content>) {
  return (
    <Content className={cn(styles.content, className)} ref={ref} {...props}>
      <div>{children}</div>
    </Content>
  );
}

export function AccordionItem({
  className,
  ref,
  children,
  ...props
}: React.ComponentProps<typeof Item>) {
  return (
    <Item className={cn(styles.item, className)} ref={ref} {...props}>
      {children}
    </Item>
  );
}

export function AccordionTrigger({
  className,
  ref,
  children,
  ...props
}: React.ComponentProps<typeof Trigger>) {
  return (
    <Trigger className={cn(styles.trigger, className)} ref={ref} {...props}>
      {children}
    </Trigger>
  );
}

export const AccordionHeader = Header;
