import {useState} from 'react';
import { useRouteLoaderData } from 'react-router';
import type {RootLoader} from '~/root';
import {useIntl} from 'react-intl';
import {Link} from '../ui/Link';
import {Text} from '../ui/Text';
import styles from './AnnouncementBar.module.css';

export function AnnouncementBar() {
  const {formatMessage} = useIntl();
  const data = useRouteLoaderData<RootLoader>('root');
  const announcements = data?.global?.announcements?.references?.nodes ?? [];

  const [isAnnoucementsBarCollapsed, setIsAnnoucementsBarCollapsed] =
    useState<boolean>(false);
  const [visibleAnnouncements, setVisibleAnnouncements] =
    useState(announcements);

  const handleRemove = (id: string) => {
    const updatedAnnouncements = visibleAnnouncements?.filter(
      (announcement) => announcement.id !== id,
    );
    setVisibleAnnouncements(updatedAnnouncements!);
    updatedAnnouncements?.length === 0 && setIsAnnoucementsBarCollapsed(true);
  };

  return (
    <aside className={styles.root} data-collapsed={isAnnoucementsBarCollapsed}>
      {visibleAnnouncements?.map((announcement) => {
        const {title, link} = announcement ?? {};

        return (
          <div className={styles.tag} key={announcement.id}>
            <Text asChild weight="light" size="xs">
              {link ? (
                <Link variant="animated-underline" to={link?.value!}>
                  {title?.value}
                </Link>
              ) : (
                <span>{title?.value}</span>
              )}
            </Text>
            <button
              className={styles.close}
              type="button"
              aria-label={formatMessage({
                id: 'close',
              })}
              onClick={() => handleRemove(announcement.id)}
            />
          </div>
        );
      })}
    </aside>
  );
}
