import {Star} from '../icons/Star';
import styles from './StarRating.module.css';

export function StarRating({rating}: {rating: number}) {
  return (
    <div className={styles.root}>
      <span className={styles['stars-empty']}>
        {Array.from({length: 5}).map((_, i) => {
          return <Star key={i} />;
        })}
      </span>
      <span className={styles['stars-full']} style={{width: `${rating * 20}%`}}>
        {Array.from({length: 5}).map((_, i) => {
          return <Star key={i} />;
        })}
      </span>
    </div>
  );
}
