import { useLocation, type Path } from 'react-router';
import {Carousel} from '../ui/Carousel';
import {Text} from '../ui/Text';
import {Link} from './Link';
import styles from './NavLinks.module.css';

export function NavLinks({
  children,
  align = 'left',
  ...props
}: {
  children: React.ReactElement<typeof NavLink>[];
  align?: 'left' | 'center';
}) {
  return (
    <Carousel
      className={styles.root}
      data-align={align}
      slidesPerView={'auto'}
      spaceBetween={20}
      mousewheel
      slideToClickedSlide
      {...props}
    >
      {children}
    </Carousel>
  );
}

export function NavLink({
  title,
  to,
}: {
  title: string;
  to: string | Partial<Path>;
}) {
  const {pathname} = useLocation();
  const isAccount = pathname.includes('/account');

  return (
    <Text
      asChild
      weight="light"
      color="medium"
      data-active={
        isAccount ? pathname.includes(String(to)) : String(to) === pathname
      }
    >
      <Link className={styles.link} to={to}>
        {title}
      </Link>
    </Text>
  );
}
