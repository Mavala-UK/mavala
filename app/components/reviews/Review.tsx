import type {YotpoReview} from '~/lib/types';
import {StarRating} from './StarRating';
import styles from './Review.module.css';

export function Review({review, ...props}: {review: YotpoReview}) {
  const formattedDate = new Date(review.created_at).toLocaleDateString(
    'fr-FR',
    {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  );

  return (
    <div className={styles.root}>
      <StarRating rating={review.score} />
      <div className={styles.review}>
        <span className={styles.title}>{review.title}</span>
        <p className={styles.content}>{review.content}</p>
      </div>
      <span className={styles.author}>
        {review.user.display_name} • {formattedDate}
      </span>
    </div>
  );
}
