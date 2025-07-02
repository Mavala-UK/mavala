import {LockIcon} from '@sanity/icons';
import {Box, Text, TextInput, Tooltip} from '@sanity/ui';
import type {StringInputProps, SanityDocument, StringSchemaType} from 'sanity';
import {useFormValue} from 'sanity';

type Props = StringInputProps<StringSchemaType & {options?: {field?: string}}>;

export function ProxyString(props: Props) {
  const {schemaType} = props;

  const path = schemaType?.options?.field;
  const doc = useFormValue([]) as SanityDocument & {store: {title: string}};
  const proxyValue = path ? doc.store?.title : '';

  return (
    <Tooltip
      content={
        <Box padding={2}>
          <Text muted size={1}>
            Cette valeur est définie dans Shopify (<code>{path}</code>)
          </Text>
        </Box>
      }
      portal
    >
      <TextInput iconRight={LockIcon} readOnly={true} value={proxyValue} />
    </Tooltip>
  );
}
