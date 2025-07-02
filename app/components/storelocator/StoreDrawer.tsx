import {useStoreLocator} from './StoreLocator';
import {FormattedMessage} from 'react-intl';
import {
  DrawerTitle,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerBody,
  DrawerFooter,
} from '~/components/ui/Drawer';
import {Heading} from '../ui/Heading';
import {Button, ButtonEffect} from '../ui/Button';
import {DialogClose} from '@radix-ui/react-dialog';
import {Text} from '../ui/Text';
import {Phone} from '../icons/Phone';
import {Mail} from '../icons/Mail';
import styles from './StoreDrawer.module.css';

export function StoreDrawer() {
  const {selectedStore} = useStoreLocator();
  const {name, address1, city, country, zip, phone, mail} =
    selectedStore?.properties ?? {};

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <DrawerContent onCloseAutoFocus={handleCloseAutoFocus}>
      <DrawerHeader>
        <Heading size="sm" asChild>
          <DrawerTitle>
            <FormattedMessage id="store_infos" />
          </DrawerTitle>
        </Heading>
        <DrawerClose />
      </DrawerHeader>
      <DrawerBody>
        <Heading asChild size="xl" className={styles.title}>
          <p>{name}</p>
        </Heading>
        <Text weight="light" className={styles.address}>
          {address1} <br /> {`${zip} ${city}, ${country}`}
        </Text>
        {phone && (
          <Text weight="light" className={styles.infos}>
            <Phone />
            <span>{phone}</span>
          </Text>
        )}
        {mail && (
          <Text weight="light" className={styles.infos}>
            <Mail />
            <span>{mail}</span>
          </Text>
        )}
      </DrawerBody>
      <DrawerFooter>
        <DialogClose asChild>
          <Button className={styles.button}>
            <ButtonEffect>
              <FormattedMessage id="close" />
            </ButtonEffect>
          </Button>
        </DialogClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
