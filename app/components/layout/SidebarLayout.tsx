import {cn} from '~/lib/utils';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {RichText} from '../common/RichText';
import styles from './SidebarLayout.module.css';

export function SidebarLayout({
  children,
  className,
}: {
  children: React.ReactElement<
    typeof SidebarLayoutContent & typeof SidebarLayoutAside
  >[];
  className?: string;
}) {
  return <section className={cn(styles.root, className)}>{children}</section>;
}

export function SidebarLayoutContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(styles.content, className)}>{children}</div>;
}

export function SidebarLayoutAside({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <aside className={cn(styles.aside, className)}>{children}</aside>;
}

export function AdditionalInfo({data}: {data: string}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  return (
    !isDesktop && <RichText data={data} className={styles['additional-info']} />
  );
}
