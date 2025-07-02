import {use} from 'react';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import type {
  ProductFaqSectionQueryResult,
  CollectionFaqSectionQueryResult,
} from 'sanity.generated';
import type {QueryResponseInitial} from '@sanity/react-loader';
import {FormattedMessage} from 'react-intl';
import {Heading} from '../ui/Heading';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {PortableText} from './PortableText';
import styles from './FaqSection.module.css';

export function FaqSection({
  data,
}: {
  data: Promise<
    QueryResponseInitial<
      ProductFaqSectionQueryResult | CollectionFaqSectionQueryResult
    >
  >;
}) {
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {questions} = use(data)?.data?.faqSection ?? {};

  if (!questions) {
    return null;
  }

  return (
    <section className={styles.root}>
      <Heading size={isDesktop ? '2xl' : 'xl'}>
        <FormattedMessage id="your_questions" />
      </Heading>
      <Accordion type="multiple" className={styles.accordion}>
        {questions?.map((question) => {
          const {title, text} = question ?? {};

          return (
            <AccordionItem value={question?._key} key={question?._key}>
              <AccordionHeader asChild>
                <h3>
                  <AccordionTrigger>{title}</AccordionTrigger>
                </h3>
              </AccordionHeader>
              <AccordionContent>
                {text && <PortableText value={text} variant="block" />}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
