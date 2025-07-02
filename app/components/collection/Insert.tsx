import {use} from 'react';
import type {InsertQueryResult} from 'sanity.generated';
import {cn} from '~/lib/utils';
import {Heading} from '../ui/Heading';
import {Button, ButtonEffect} from '../ui/Button';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {SanityImage} from '../common/SanityImage';
import {Link} from '../common/Link';
import styles from './Insert.module.css';

export function Insert({
  insert,
  className,
}: {
  insert: Promise<{data: InsertQueryResult}>;
  className?: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {image, title, link} = use(insert).data?.insert ?? {};

  if (!title) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.infos}>
        <Heading size={isDesktop ? 'xl' : 'lg'}>{title}</Heading>
        <Button theme="ghost" asChild>
          <Link to={link?.url ?? '#'}>
            <ButtonEffect>{link?.text}</ButtonEffect>
          </Link>
        </Button>
      </div>
      {image && (
        <SanityImage
          className={styles.image}
          data={image!}
          aspectRatio={isDesktop ? '568/350' : '1/1'}
          sizes="(min-width: 64rem) 40vw, 100vw"
        />
      )}
    </div>
  );
}
