import type {ListItemBuilder} from 'sanity/structure';
import defineStructure from '../utils/defineStructure';

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Accueil')
    .schemaType('home')
    .child(S.editor().title('Accueil').schemaType('home').documentId('home')),
);
