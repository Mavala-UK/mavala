import {FormattedMessage} from 'react-intl';
import {type RegularSearchReturn} from '~/lib/search';
import {ProductsList} from '../collection/ProductsList';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsProducts({products}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return <ProductsList connection={products} />;
}

function SearchResultsEmpty() {
  return <FormattedMessage id="no_results_found" />;
}
