import {cn} from '~/lib/utils';
import {SanityImage, type ImageType} from '~/components/common/SanityImage';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/Accordion';
import {Text} from '~/components/ui/Text';
import styles from './Steps.module.css';

export type StepsType = {
  _type: 'steps';
  _key: string;
  steps?: Array<{
    image?: ImageType;
    title?: string | null;
    text?: string | null;
    _key: string;
  }>;
};

export function Steps({data}: {data: StepsType}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {steps} = data;

  return (
    <div className={cn('editorial-block', styles.root)}>
      {isDesktop ? (
        <ul className={styles.steps}>
          {steps?.map((step) => {
            const {image, title, text} = step ?? {};

            return (
              <li key={step?._key} className={styles.step}>
                {image && (
                  <SanityImage
                    data={image}
                    aspectRatio="1/1"
                    sizes="12.5rem"
                    style={{width: undefined}}
                    className={styles.image}
                  />
                )}
                <div className={styles.content}>
                  <Text weight="medium">{title}</Text>
                  <Text size="lg" weight="light">
                    {text}
                  </Text>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <Accordion type="multiple">
          {steps?.map((step) => {
            const {image, title, text} = step ?? {};

            return (
              <AccordionItem value={step._key} key={step._key}>
                <AccordionHeader asChild>
                  <AccordionTrigger>
                    <Text weight="medium" className={styles.title}>
                      {title}
                    </Text>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <Text weight="light">{text}</Text>
                  {image && (
                    <SanityImage
                      data={image}
                      aspectRatio="1/1"
                      sizes="10.375rem"
                      style={{width: undefined}}
                      className={styles.image}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
