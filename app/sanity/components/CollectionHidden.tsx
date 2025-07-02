import {WarningOutlineIcon} from '@sanity/icons';
import {Box, Card, Flex, Stack, Text} from '@sanity/ui';
import type {StringFieldProps} from 'sanity';

export function CollectionHiddenInput(props: StringFieldProps) {
  return (
    <Card padding={4} radius={2} shadow={1} tone="critical">
      <Flex align="flex-start">
        <Text>
          <WarningOutlineIcon />
        </Text>
        <Box flex={1} marginLeft={3}>
          <Box>
            <Text weight="semibold">Cette collection est masquée</Text>
          </Box>
          <Stack marginTop={4} space={2}>
            <Text size={1}>Elle a été supprimée de Shopify.</Text>
          </Stack>
        </Box>
      </Flex>
    </Card>
  );
}
