import {useRef} from 'react';
import { useLoaderData } from 'react-router';
import {type loader} from '~/routes/_store.($locale).faq';
import {
  SidebarLayout,
  SidebarLayoutContent,
  SidebarLayoutAside,
  AdditionalInfo,
} from '../layout/SidebarLayout';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {PageIntro} from '../common/PageIntro';
import {RichText} from '../common/RichText';
import {useIntl} from 'react-intl';
import {type FaqSectionType} from '../layout/SummarySections';
import {SummarySections} from '../layout/SummarySections';

export function FaqMain() {
  const {formatMessage} = useIntl();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const {faq} = useLoaderData<typeof loader>();
  const {title, description, additionalInfo} = faq ?? {};
  const sections = faq.sections?.references?.nodes;
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    <SidebarLayout>
      <SidebarLayoutContent>
        <PageIntro title={title?.value!} description={description?.value!} />
        <AdditionalInfo data={additionalInfo?.value!} />
        <SummarySections
          variant="accordion"
          sections={sections as FaqSectionType[]}
          sectionRefs={sectionRefs}
          title={formatMessage({
            id: 'fast_access',
          })}
        />
        <SummarySections
          variant="sections"
          sections={sections as FaqSectionType[]}
          sectionRefs={sectionRefs}
        />
      </SidebarLayoutContent>
      <SidebarLayoutAside>
        <SummarySections
          variant="list"
          sections={sections as FaqSectionType[]}
          sectionRefs={sectionRefs}
          title={formatMessage({
            id: 'fast_access',
          })}
        />
        {isDesktop && additionalInfo && (
          <RichText data={additionalInfo?.value} />
        )}
      </SidebarLayoutAside>
    </SidebarLayout>
  );
}
