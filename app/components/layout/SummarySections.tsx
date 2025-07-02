import {useEffect, useState, useRef} from 'react';
import type {PortableTextBlock} from '@portabletext/react';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {PortableText} from '../common/PortableText';
import {Text} from '../ui/Text';
import {Heading} from '../ui/Heading';
import styles from './SummarySections.module.css';
import {RichText} from '../common/RichText';

/*  Article section type */
export type ArticleSectionType = {
  _type: 'section';
  _key: string;
  title?: string | null;
  content?: PortableTextBlock | null;
};

/*  Faq section type */
export type FaqSectionType = {
  id: string;
  title?: {
    value: string;
  };
  accordion: {
    references: {
      nodes: {
        id: string;
        title?: {
          value: string;
        };
        text?: {
          value: string;
        };
      }[];
    };
  };
};

/*  Get section type */
function getSectionType(section: ArticleSectionType | FaqSectionType) {
  if ('_key' in section) {
    return {
      id: section._key,
      title: section.title ?? '',
      isArticleSection: true,
      content: section.content,
    };
  } else {
    return {
      id: section.id,
      title: section.title?.value ?? '',
      isFaqSection: true,
      accordions: section.accordion.references.nodes,
    };
  }
}

export function SummarySections({
  variant,
  title,
  sections,
  sectionRefs,
}: {
  variant: 'list' | 'accordion' | 'sections';
  title?: string;
  sections: ArticleSectionType[] | FaqSectionType[];
  sectionRefs: React.RefObject<Record<string, HTMLElement | null>>;
}) {
  const getAnchorId = (key: string) => `section-${key}`;
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const summaryMobileRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleClick = (sectionKey: string) => {
    const anchorId = getAnchorId(sectionKey);
    const el = sectionRefs.current[anchorId];

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    if (summaryMobileRef.current) {
      const height = summaryMobileRef.current.getBoundingClientRect().height;

      document.documentElement.style.setProperty(
        '--height-summary-mobile',
        `${Math.round(height)}px`,
      );
    }
  };

  useEffect(() => {
    if (!sections) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
      },
    );

    Object.values(sectionRefs.current!).forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      Object.values(sectionRefs.current!).forEach((el) => {
        if (el) observerRef.current?.unobserve(el);
      });
    };
  }, [sections]);

  const SummaryList = () => {
    return (
      <ul>
        {sections?.map((section) => {
          const {id, title} = getSectionType(section);

          return (
            <li key={id}>
              <Text asChild weight="light">
                <button
                  data-active={getAnchorId(id) === activeSection}
                  onClick={() => handleClick(id)}
                >
                  {title}
                </button>
              </Text>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {(() => {
        switch (variant) {
          case 'list':
            return (
              isDesktop && (
                <div className={styles.summary}>
                  <Text weight="medium" asChild>
                    <strong>{title}</strong>
                  </Text>
                  <SummaryList />
                </div>
              )
            );
          case 'accordion':
            return (
              !isDesktop && (
                <Accordion
                  type="single"
                  collapsible
                  className={styles.summary}
                  ref={summaryMobileRef!}
                >
                  <AccordionItem value={'summary'}>
                    <AccordionHeader>
                      <AccordionTrigger asChild>
                        <p>{title}</p>
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>
                      <SummaryList />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            );
          case 'sections':
            return (
              <div className={styles.sections}>
                {sections?.map((section) => {
                  const {
                    id,
                    title,
                    isArticleSection,
                    isFaqSection,
                    content,
                    accordions,
                  } = getSectionType(section);

                  return (
                    <div
                      key={id}
                      className={styles.section}
                      id={getAnchorId(id)}
                      ref={(el) => {
                        sectionRefs.current[getAnchorId(id)] = el;
                      }}
                    >
                      {isArticleSection && <PortableText value={content!} />}
                      {isFaqSection && (
                        <>
                          <Heading size={isDesktop ? 'xl' : 'md'}>
                            {title}
                          </Heading>
                          <Accordion
                            type="multiple"
                            className={styles.accordion}
                          >
                            {accordions?.map((accordion) => {
                              const {id, title, text} = accordion ?? {};

                              return (
                                <AccordionItem value={id} key={id}>
                                  <AccordionHeader asChild>
                                    <AccordionTrigger>
                                      <Text
                                        weight="medium"
                                        className={styles.title}
                                      >
                                        {title?.value}
                                      </Text>
                                    </AccordionTrigger>
                                  </AccordionHeader>
                                  <AccordionContent>
                                    <RichText data={text?.value} />
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
        }
      })()}
    </>
  );
}
