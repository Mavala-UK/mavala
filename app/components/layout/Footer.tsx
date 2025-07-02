import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import {Image} from '@shopify/hydrogen';
import type {FooterQuery} from 'storefrontapi.generated';
import {useMenu} from '~/hooks/useMenu';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {LinksList} from './LinksList';
import {Text} from '../ui/Text';
import {Newsletter} from './Newsletter';
import {Link} from '../ui/Link';
import {Heading} from '../ui/Heading';
import {Youtube} from '../icons/Youtube';
import {Facebook} from '../icons/Facebook';
import {Instagram} from '../icons/Instagram';
import styles from './Footer.module.css';

export function Footer({footer}: {footer: FooterQuery}) {
  const {buildItemUrl} = useMenu();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const data = useRouteLoaderData<RootLoader>('root');
  const {shop, sites} = data ?? {};
  const {isMavalaFrance, isMavalaCorporate} = sites ?? {};
  const {menu: menuFooter, legalMenu, content} = footer ?? {};
  const {
    labelFooter,
    labelRights,
    labelSiteBy,
    paymentIcons,
    youtubeUrl,
    facebookUrl,
    instagramUrl,
  } = content ?? {};
  const socials = [youtubeUrl, facebookUrl, instagramUrl];

  const handleCookieManagement = () => {
    if (window.openAxeptioCookies) window.openAxeptioCookies();
  };

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-infos-section']}>
        {isMavalaFrance && <Newsletter />}
        {isMavalaCorporate && (
          <Heading size={isDesktop ? 'xl' : 'lg'} asChild>
            <p>{labelFooter?.value}</p>
          </Heading>
        )}
        <div className={styles['social-icons']}>
          {socials?.map((social, index) => {
            const url = social?.value;

            return (
              <Link
                key={`${url}-${index + 1}`}
                to={url!}
                target="_blank"
                rel="noopener noreferrer"
              >
                {(() => {
                  switch (true) {
                    case url?.includes('youtube'):
                      return <Youtube />;
                    case url?.includes('facebook'):
                      return <Facebook />;
                    case url?.includes('instagram'):
                      return <Instagram />;
                  }
                })()}
              </Link>
            );
          })}
        </div>
      </div>
      <div className={styles.menus}>
        {menuFooter?.items?.map((item) => (
          <LinksList
            key={item.id}
            size="sm"
            variant="menu-item"
            items={item.items!}
            title={item.title!}
          />
        ))}
      </div>
      <div className={styles.subfooter}>
        <div className={styles['payment-icons']}>
          {paymentIcons?.references?.nodes.map(
            (icon) =>
              icon.image && (
                <Image
                  data={icon.image}
                  srcSet={undefined}
                  sizes={`${icon.image.width}px`}
                  style={{width: undefined}}
                  key={icon.image.id}
                />
              ),
          )}
        </div>
        <ul className={styles['legal-links']}>
          {legalMenu?.items?.map((item) => (
            <li key={item.id}>
              <Text size="xs" weight="light" asChild>
                {!item?.url?.includes('#') ? (
                  <Link to={buildItemUrl(item)} className={styles.link}>
                    {item.title}
                  </Link>
                ) : (
                  <button type="button" onClick={handleCookieManagement}>
                    {item.title}
                  </button>
                )}
              </Text>
            </li>
          ))}
        </ul>
        <Text
          asChild
          size="xs"
          color="light"
          className={styles.credits}
          weight="light"
        >
          <small>
            <span>
              © {shop?.name} - {labelRights?.value} {new Date().getFullYear()}
            </span>
            <span>
              {labelSiteBy?.value}{' '}
              <Link
                to="https://ultro.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ultrō
              </Link>
            </span>
          </small>
        </Text>
      </div>
    </footer>
  );
}
