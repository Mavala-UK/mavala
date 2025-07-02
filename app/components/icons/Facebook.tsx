import {useId} from 'react';

export function Facebook() {
  const id = useId();

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={id}
    >
      <title id={id}>Facebook</title>
      <path
        d="M21.2645 28.5V20.7459H23.7711L24.1452 17.7235H21.2645V15.7966C21.2645 14.9186 21.4965 14.3281 22.7086 14.3281H24.25V11.6165C23.9806 11.5777 23.0678 11.5 22.0053 11.5C19.783 11.5 18.2641 12.9063 18.2641 15.4936V17.7235H15.75V20.7459H18.2641V28.5H21.2645Z"
        fill="currentcolor"
      />
    </svg>
  );
}
