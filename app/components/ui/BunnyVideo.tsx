import styles from './BunnyVideo.module.css';

export function BunnyVideo({id, lazy}: {id: string; lazy?: boolean}) {
  const settings = new URLSearchParams({
    autoplay: 'true',
    loop: 'true',
    muted: 'true',
    preload: 'true',
    responsive: 'true',
  });

  return (
    <iframe
      src={`https://iframe.mediadelivery.net/embed/421645/${id}?${settings.toString()}#t=0.001`}
      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
      title="Video player"
      loading={lazy ? 'lazy' : undefined}
      className={styles.root}
    />
  );
}
