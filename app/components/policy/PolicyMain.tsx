import { useLoaderData } from 'react-router';
import {type loader} from '~/routes/_store.($locale).policies.$handle';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {HtmlParser} from '../common/HtmlParser';
import {Heading} from '../ui/Heading';
import styles from './PolicyMain.module.css';

export function PolicyMain() {
  const {policy} = useLoaderData<typeof loader>();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {body, translations} = policy ?? {};

  return (
    <div className={styles.root}>
      <Heading className={styles.title} size={isDesktop ? '3xl' : 'xl'} asChild>
        <h1>{policy.title}</h1>
      </Heading>
      <HtmlParser
        className={styles.content}
        html={translations?.[0]?.value ?? body}
      />
    </div>
  );
}
