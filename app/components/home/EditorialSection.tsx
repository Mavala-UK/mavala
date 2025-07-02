import type {EditorialSection} from 'sanity.generated';
import {SanityImage} from '../common/SanityImage';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {type ImageType} from '../common/SanityImage';
import {LinkType} from '~/sanity/types';
import {PortableTextEditorial} from 'sanity.generated';
import {stegaClean} from '@sanity/client/stega';
import {PortableText} from '../common/PortableText';
import {Heading} from '../ui/Heading';
import {Button, ButtonEffect} from '../ui/Button';
import {Link} from '../common/Link';
import styles from './EditorialSection.module.css';

type EditorialSectionType = {
  _type: 'editorialSection';
  _key: string | null;
  title: string | null;
  text: PortableTextEditorial | null;
  link: LinkType | null;
  image: ImageType | null;
  imagePosition: 'left' | 'right' | null;
} | null;

export function EditorialSection({data}: {data: EditorialSectionType}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  const {title, text, link, image, imagePosition} = data ?? {};
  const pathWithLocale = usePathWithLocale(link?.url!);

  if (!data || !title || !image) {
    return null;
  }

  return (
    <section
      className={styles.root}
      data-image-position={stegaClean(imagePosition)}
    >
      <div className={styles.content}>
        <Heading className={styles.title} size={isDesktop ? '2xl' : 'xl'}>
          {title}
        </Heading>
        <PortableText className={styles.text} value={text!} variant="block" />
        {link?.url && (
          <Button className={styles.link} asChild>
            <Link to={pathWithLocale}>
              <ButtonEffect>{link.text}</ButtonEffect>
            </Link>
          </Button>
        )}
      </div>
      <div className={styles['image-wrapper']}>
        {image && (
          <SanityImage
            className={styles.image}
            data={image}
            aspectRatio="1/1"
            sizes="(min-width: 120rem) 55.5rem, (min-width: 64rem) 41.5vw, 90vw"
          />
        )}
      </div>
    </section>
  );
}
