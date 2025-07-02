import {cn} from '~/lib/utils';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Heading} from '../ui/Heading';
import {Text} from '../ui/Text';
import styles from './PageIntro.module.css';

export function PageIntro({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  return (
    <header className={cn(styles.root, className)}>
      <Heading size={isDesktop ? '3xl' : 'xl'} asChild>
        <h1>{title}</h1>
      </Heading>
      {description && (
        <Text weight="light" size={isDesktop ? 'lg' : 'md'}>
          {description}
        </Text>
      )}
    </header>
  );
}
