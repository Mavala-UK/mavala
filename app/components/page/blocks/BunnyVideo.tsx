import {BunnyVideo as IframeVideo} from '~/components/ui/BunnyVideo';
import styles from './BunnyVideo.module.css';

export type BunnyVideoType = {
  _type: 'bunnyVideo';
  _key: string;
  id: string;
};

export function BunnyVideo({value}: {value: BunnyVideoType}) {
  return (
    <div className={styles.root}>
      <IframeVideo id={value?.id} />
    </div>
  );
}
