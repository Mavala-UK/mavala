import {useId} from 'react';

export function Mail() {
  const id = useId();

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={id}
    >
      <title id={id}>Mail</title>
      <path
        d="M3.3328 3.3335H16.6661C17.5828 3.3335 18.3328 4.0835 18.3328 5.00016V15.0002C18.3328 15.9168 17.5828 16.6668 16.6661 16.6668H3.3328C2.41614 16.6668 1.66614 15.9168 1.66614 15.0002V5.00016C1.66614 4.0835 2.41614 3.3335 3.3328 3.3335Z"
        stroke="currentcolor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3328 5L9.99947 10.8333L1.66614 5"
        stroke="currentcolor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
