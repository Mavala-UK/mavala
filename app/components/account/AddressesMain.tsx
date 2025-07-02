import {createContext, use, useEffect} from 'react';
import {Form} from '@radix-ui/react-form';
import { useOutletContext, useNavigation, useActionData, Form as RemixForm } from 'react-router';
import {FormattedMessage, useIntl} from 'react-intl';
import type {
  CustomerAddress,
  CustomerAddressInput,
} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {type ActionResponse} from '~/routes/_store.($locale).account.addresses';
import {Address} from './Address';
import {Text} from '../ui/Text';
import {Button, ButtonEffect} from '../ui/Button';
import {FormCheckbox, FormField} from '../ui/Form';
import {Link} from '../ui/Link';
import styles from './AddressesMain.module.css';

export type AddressProps = {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'] | null;
};

export function AddressesMain() {
  const {view} = useAddressContext();

  if (view === 'form') {
    return <AddressForm />;
  }

  return <AddressesList />;
}

function AddressesList() {
  const {changeView, updateAddressProps} = useAddressContext();
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer ?? {};

  const handleAddNew = () => {
    document.startViewTransition(() => {
      updateAddressProps({
        addressId: 'NEW_ADDRESS_ID',
        address: {},
        defaultAddress,
      });
      changeView('form');
    });
  };

  return (
    <div className={styles.list}>
      {!addresses.nodes.length ? (
        <Text weight="light">
          <FormattedMessage id="no_address" />
        </Text>
      ) : (
        <div className={styles.grid}>
          {addresses.nodes.map((address) => (
            <AddressItem
              address={address}
              defaultAddress={defaultAddress}
              key={address.id}
            />
          ))}
        </div>
      )}
      <Button className={styles.add} type="button" onClick={handleAddNew}>
        <ButtonEffect>
          <FormattedMessage id="add_address" />
        </ButtonEffect>
      </Button>
    </div>
  );
}

export type AddressContextType = {
  view: 'list' | 'form';
  changeView: (view: 'list' | 'form') => void;
  addressProps: AddressProps;
  updateAddressProps: (props: AddressProps) => void;
  actionData: ActionResponse | null | undefined;
  updateActionData: (data: ActionResponse | null) => void;
};

export const AddressContext = createContext<AddressContextType>({
  view: 'list',
  changeView: () => {},
  addressProps: {addressId: '', address: {}, defaultAddress: null},
  updateAddressProps: () => {},
  actionData: undefined,
  updateActionData: () => {},
});

function useAddressContext() {
  return use(AddressContext);
}

function AddressItem({
  address,
  defaultAddress,
}: {
  address: CustomerAddress;
  defaultAddress: CustomerFragment['defaultAddress'] | undefined;
}) {
  const {updateAddressProps, changeView} = useAddressContext();

  const handleUpdate = () => {
    document.startViewTransition(() => {
      updateAddressProps({addressId: address.id, address, defaultAddress});
      changeView('form');
    });
  };

  return (
    <Address address={address!} variant="form">
      <div className={styles.actions}>
        <Text size="sm" weight="light" asChild>
          <Link variant="underline" asChild>
            <button type="button" onClick={handleUpdate}>
              <FormattedMessage id="edit" />
            </button>
          </Link>
        </Text>
        {address.id !== defaultAddress?.id && (
          <RemixForm method="DELETE" viewTransition>
            <input type="hidden" name="addressId" defaultValue={address.id} />
            <Text size="sm" weight="light" asChild>
              <Link variant="underline" asChild>
                <button type="submit">
                  <FormattedMessage id="delete" />
                </button>
              </Link>
            </Text>
          </RemixForm>
        )}
      </div>
      {address.id === defaultAddress?.id && (
        <Text color="accent" size="sm" weight="light" asChild>
          <span>
            <FormattedMessage id="default_address" />
          </span>
        </Text>
      )}
    </Address>
  );
}

export function AddressForm() {
  const {formatMessage} = useIntl();

  const {
    addressProps,
    updateAddressProps,
    changeView,
    actionData,
    updateActionData,
  } = useAddressContext();

  const {addressId, address, defaultAddress} = addressProps;
  const {state} = useNavigation();
  const remixActionData = useActionData<ActionResponse>();
  const error = actionData?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;
  const {
    firstName,
    lastName,
    company,
    address1,
    address2,
    city,
    zip,
    territoryCode,
    phoneNumber,
  } = address ?? {};

  const handleGoBack = () => {
    document.startViewTransition(() => {
      changeView('list');
      updateAddressProps({addressId: '', address: {}, defaultAddress: null});
    });
  };

  useEffect(() => {
    if (state === 'loading') {
      updateActionData(remixActionData ?? null);
    }
  }, [remixActionData, updateActionData, state]);

  useEffect(() => {
    if (
      state === 'idle' &&
      (actionData?.createdAddress || actionData?.updatedAddress)
    ) {
      changeView('list');
      updateAddressProps({addressId: '', address: {}, defaultAddress: null});
      updateActionData(null);
      window.scrollTo({top: 0});
    }
  }, [
    actionData?.createdAddress,
    actionData?.updatedAddress,
    updateActionData,
    updateAddressProps,
    changeView,
    state,
  ]);

  return (
    <div className={styles.form}>
      <header>
        <Text size="sm" weight="light" asChild>
          <Link variant="underline" asChild>
            <button type="button" onClick={handleGoBack}>
              <FormattedMessage id="back_addresses" />
            </button>
          </Link>
        </Text>
      </header>
      <Form asChild>
        <RemixForm
          method={addressId === 'NEW_ADDRESS_ID' ? 'POST' : 'PUT'}
          viewTransition
        >
          <input type="hidden" name="addressId" defaultValue={addressId} />
          <FormField
            label={formatMessage({
              id: 'first_name',
            })}
            name="firstName"
            autoComplete="given-name"
            defaultValue={firstName ?? ''}
            type="text"
            required
          />
          <FormField
            label={formatMessage({
              id: 'last_name',
            })}
            name="lastName"
            autoComplete="family-name"
            type="text"
            defaultValue={lastName ?? ''}
            required
          />
          <FormField
            label={formatMessage({
              id: 'company',
            })}
            name="company"
            autoComplete="organization"
            type="text"
            defaultValue={company ?? ''}
          />
          <FormField
            label={`${formatMessage({
              id: 'address',
            })} 1`}
            name="address1"
            autoComplete="address-line1"
            defaultValue={address1 ?? ''}
            required
          />
          <FormField
            label={`${formatMessage({
              id: 'address',
            })} 2`}
            name="address2"
            autoComplete="address-line2"
            defaultValue={address2 ?? ''}
          />
          <FormField
            label={formatMessage({
              id: 'city',
            })}
            name="city"
            autoComplete="address-level2"
            defaultValue={city ?? ''}
            required
          />
          <FormField
            label={formatMessage({
              id: 'zip_code',
            })}
            name="zip"
            autoComplete="postal-code"
            defaultValue={zip ?? ''}
            required
          />
          <FormField
            label="Pays (FR)"
            autoComplete="country"
            defaultValue={territoryCode ?? ''}
            name="territoryCode"
            required
            maxLength={2}
            pattern="^[A-Z]{2}$"
            messages={{
              patternMismatch: formatMessage({id: 'pattern_mismatch_country'}),
            }}
          />
          <FormField
            type="tel"
            label={`${formatMessage({
              id: 'phone_number',
            })} (+33600000000)`}
            name="phoneNumber"
            autoComplete="tel"
            defaultValue={phoneNumber ?? ''}
            pattern="^(\+|00)[1-9][0-9 \-\(\)\.]{7,32}$"
            messages={{
              patternMismatch: formatMessage({id: 'pattern_mismatch_phone'}),
            }}
          />
          <FormCheckbox
            label={formatMessage({
              id: 'set_default_address',
            })}
            name="defaultAddress"
            defaultChecked={isDefaultAddress}
          />
          <Button
            type="submit"
            aria-busy={state !== 'idle'}
            aria-disabled={state !== 'idle'}
          >
            <ButtonEffect>
              {addressId === 'NEW_ADDRESS_ID' ? (
                <FormattedMessage id="add_this_address" />
              ) : (
                <FormattedMessage id="update" />
              )}
            </ButtonEffect>
          </Button>
          <Text size="xs" weight="light" role="status" color={'accent'}>
            {state === 'idle' && error}
          </Text>
        </RemixForm>
      </Form>
    </div>
  );
}
