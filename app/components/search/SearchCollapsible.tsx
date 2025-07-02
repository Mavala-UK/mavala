import {useRef} from 'react';
import type {Trigger, Content} from '@radix-ui/react-collapsible';
import {Search as SearchIcon} from '../icons/Search';
import {useIntl} from 'react-intl';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/Collapsible';
import {SearchForm} from './SearchForm';

export function SearchCollapsible({className}: {className?: string}) {
  const {formatMessage} = useIntl();
  const searchTriggerRef = useRef<React.ComponentRef<typeof Trigger>>(null);
  const searchContentRef = useRef<React.ComponentRef<typeof Content>>(null);

  return (
    <Collapsible
      className={className}
      triggerRef={searchTriggerRef}
      contentRef={searchContentRef}
    >
      <CollapsibleTrigger
        title={formatMessage({id: 'search'})}
        ref={searchTriggerRef}
      >
        <SearchIcon />
      </CollapsibleTrigger>
      <CollapsibleContent ref={searchContentRef}>
        <SearchForm collapsible />
      </CollapsibleContent>
    </Collapsible>
  );
}
