import type {ListItemBuilder} from 'sanity/structure';
import defineStructure from '../utils/defineStructure';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Translations')
    .schemaType('translation')
    .child(S.documentTypeList('translation').title('Translations')),
);
