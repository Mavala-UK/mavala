import {defineType} from 'sanity';
import {ProxyString} from '../../components/ProxyString';

export const proxyStringType = defineType({
  name: 'proxyString',
  title: 'Titre',
  type: 'string',
  components: {
    input: ProxyString,
  },
});
