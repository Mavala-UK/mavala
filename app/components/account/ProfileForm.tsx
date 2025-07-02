import {Form} from '@radix-ui/react-form';
import type {CustomerFragment} from 'customer-accountapi.generated';
import type {ActionResponse} from '~/routes/_store.($locale).account.profile';
import { Form as RemixForm, useActionData, useNavigation, useOutletContext } from 'react-router';
import {useIntl, FormattedMessage} from 'react-intl';
import {Button, ButtonEffect} from '../ui/Button';
import {FormField} from '../ui/Form';
import {Text} from '../ui/Text';
import styles from './ProfileForm.module.css';

export function ProfileForm() {
  const {formatMessage} = useIntl();
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state, formAction} = useNavigation();
  const actionData = useActionData<ActionResponse>();
  const customer = actionData?.customer ?? account?.customer;
  const {firstName, lastName, emailAddress, defaultAddress} = customer ?? {};
  const phoneNumber =
    customer?.phoneNumber?.phoneNumber ?? defaultAddress?.phoneNumber;
  const isUpdating = Boolean(state !== 'idle' && formAction);
  const isUpdated = Boolean(state === 'idle' && actionData);

  return (
    <div className={styles.root}>
      <Form asChild>
        <RemixForm method="PUT" viewTransition>
          <FormField
            label={formatMessage({
              id: 'first_name',
            })}
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            defaultValue={firstName ?? ''}
          />
          <FormField
            label={formatMessage({
              id: 'last_name',
            })}
            name="lastName"
            type="text"
            autoComplete="family-name"
            defaultValue={lastName ?? ''}
            required
          />
          <FormField
            label={formatMessage({
              id: 'your_email',
            })}
            name="emailAddress"
            type="email"
            defaultValue={emailAddress?.emailAddress ?? ''}
            readOnly
          />
          {phoneNumber && (
            <FormField
              label={formatMessage({
                id: 'phone_number',
              })}
              name="phoneNumber"
              type="tel"
              defaultValue={phoneNumber ?? ''}
              readOnly
            />
          )}
          <Button
            type="submit"
            aria-busy={isUpdating}
            aria-disabled={isUpdating}
          >
            <ButtonEffect>
              <FormattedMessage id="update_info" />
            </ButtonEffect>
          </Button>
          <Text
            size="xs"
            weight="light"
            role="status"
            color={actionData?.error ? 'accent' : 'medium'}
            data-active={isUpdated}
          >
            {isUpdated &&
              (actionData?.error ?? <FormattedMessage id="updated_info" />)}
          </Text>
        </RemixForm>
      </Form>
    </div>
  );
}
