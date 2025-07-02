import styles from './Table.module.css';
import {cn} from '~/lib/utils';

export function Table({
  className,
  ref,
  ...props
}: React.ComponentProps<'table'>) {
  return (
    <div className={cn(styles.root, className)}>
      <table ref={ref} {...props} />
    </div>
  );
}

export function TableHead({
  className,
  ref,
  ...props
}: React.ComponentProps<'thead'>) {
  return <thead className={cn(styles.head, className)} ref={ref} {...props} />;
}

export function TableBody({
  className,
  ref,
  ...props
}: React.ComponentProps<'tbody'>) {
  return <tbody className={cn(styles.body, className)} ref={ref} {...props} />;
}

export function TableFoot({
  className,
  ref,
  ...props
}: React.ComponentProps<'tfoot'>) {
  return <tfoot className={cn(styles.foot, className)} ref={ref} {...props} />;
}

export function TableRow({
  className,
  ref,
  ...props
}: React.ComponentProps<'tr'>) {
  return <tr className={cn(styles.row, className)} ref={ref} {...props} />;
}

export function TableHeader({
  className,
  ref,
  ...props
}: React.ComponentProps<'th'>) {
  return <th className={cn(styles.header, className)} ref={ref} {...props} />;
}

export function TableCell({
  className,
  ref,
  ...props
}: React.ComponentProps<'td'>) {
  return <td className={cn(styles.cell, className)} ref={ref} {...props} />;
}
