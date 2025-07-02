import {useId} from 'react';

export function Youtube() {
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
      <title id={id}>YouTube</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.8204 13.2008C28.6699 13.4307 29.3326 14.1038 29.5624 14.9634C30.1632 17.4157 30.1241 22.0521 29.575 24.5427C29.3478 25.4023 28.6825 26.0728 27.833 26.3053C25.4346 26.9056 14.6922 26.8315 12.4327 26.3053C11.5831 26.0754 10.9204 25.4023 10.6907 24.5427C10.1239 22.2054 10.163 17.2624 10.6781 14.9762C10.9053 14.1166 11.5705 13.446 12.4201 13.2136C15.6264 12.5366 26.6792 12.7551 27.8204 13.2008ZM18.2268 16.7643L23.377 19.7531L18.2268 22.7418V16.7643Z"
        fill="currentcolor"
      />
    </svg>
  );
}
