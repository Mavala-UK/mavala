import { useRouteLoaderData } from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {RootLoader} from '~/root';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Carousel} from '../ui/Carousel';
import {Text} from '../ui/Text';
import {Button, ButtonEffect} from '../ui/Button';
import {Link} from '../common/Link';
import styles from './Ctas.module.css';

export function Ctas() {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const data = useRouteLoaderData<RootLoader>('root');
  const ctas = data?.global?.ctas?.references?.nodes;

  if (!ctas) {
    return null;
  }

  return (
    <aside className={styles.root}>
      <Carousel
        mousewheel={{forceToAxis: true}}
        spaceBetween={8}
        slidesPerView={ctas?.length === 1 ? 1 : 1.35}
        breakpoints={{
          1024: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
        }}
      >
        {ctas?.map((cta) => {
          const {picto, title, text: description, link} = cta ?? {};
          const icon = picto?.reference?.image;
          const {text, url} = link?.reference ?? {};

          return (
            <div key={cta.id} className={styles.card}>
              <div className={styles.content}>
                <span className={styles.picto}>
                  <Image
                    data={icon!}
                    srcSet={undefined}
                    sizes={`${icon?.width}px`}
                  />
                </span>
                <Text
                  size={isDesktop ? 'lg' : 'sm'}
                  weight={isDesktop ? 'light' : 'medium'}
                  className={styles.title}
                >
                  {title?.value}
                </Text>
                <Text
                  size={isDesktop ? 'md' : 'sm'}
                  color="medium"
                  weight="light"
                >
                  {description?.value}
                </Text>
              </div>
              <Button asChild theme="light">
                <Link to={url?.value ?? '#'}>
                  <ButtonEffect>{text?.value}</ButtonEffect>
                </Link>
              </Button>
            </div>
          );
        })}
      </Carousel>
    </aside>
  );
}
