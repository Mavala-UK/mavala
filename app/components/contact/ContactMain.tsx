import {useState} from 'react';
import { useLoaderData, useRouteLoaderData } from 'react-router';
import {RootLoader} from '~/root';
import {type loader} from '~/routes/_store.($locale).contact';
import {useForm} from '@formspree/react';
import {
  SidebarLayout,
  SidebarLayoutContent,
  SidebarLayoutAside,
  AdditionalInfo,
} from '../layout/SidebarLayout';
import {usePathWithLocale} from '~/hooks/usePathWithLocale';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import {Text} from '../ui/Text';
import {PageIntro} from '../common/PageIntro';
import {useIntl, FormattedMessage} from 'react-intl';
import {Form, FormField, FormCheckbox} from '../ui/Form';
import {Button, ButtonEffect} from '../ui/Button';
import {Link} from '../ui/Link';
import {RichText} from '../common/RichText';
import styles from './ContactMain.module.css';

export function ContactMain() {
  const {formatMessage} = useIntl();
  const pathWithLocale = usePathWithLocale(`/policies`);
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const data = useRouteLoaderData<RootLoader>('root');
  const {sites, customer} = data ?? {};
  const {isMavalaFrance, isMavalaCorporate} = sites ?? {};
  const {firstName, lastName, emailAddress, phoneNumber, defaultAddress} =
    customer ?? {};
  const {contact, privacyPolicy} = useLoaderData<typeof loader>();
  const {title, description, formspreeId, address, additionalInfo} =
    contact ?? {};
  const [state, handleSubmit, reset] = useForm(formspreeId?.value!);

  let OBJECT_MESSAGES: string[];

  switch (true) {
    case isMavalaFrance:
      OBJECT_MESSAGES = [
        'product_advice_and_information',
        'points_of_sale',
        'adverse_effect_following_use_of_product',
        'question_about_my_order',
        'others',
      ];
      break;
    case isMavalaCorporate:
      OBJECT_MESSAGES = [
        'product_tips',
        'points_of_sale',
        'testimonials',
        'reaction_to_a_product',
        'defective_product',
        'privacy_policy_personal_data',
        'others',
      ];
      break;
    default:
      OBJECT_MESSAGES = [];
      break;
  }

  const [valueSelect, setValueSelect] = useState<string>(
    formatMessage({
      id: OBJECT_MESSAGES[0],
    }),
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValueSelect(
      formatMessage({
        id: event.target.value,
      }),
    );
  };

  return (
    <SidebarLayout>
      <SidebarLayoutContent>
        <PageIntro title={title?.value!} description={description?.value!} />
        <AdditionalInfo data={additionalInfo?.value!} />
        <Form onSubmit={handleSubmit}>
          {!state.succeeded ? (
            <>
              <div className={styles.fields}>
                <FormField
                  className={styles.field}
                  type="text"
                  name="first_name"
                  autoComplete="given-name"
                  required
                  defaultValue={firstName ?? ''}
                  label={formatMessage({
                    id: 'first_name',
                  })}
                />
                <FormField
                  className={styles.field}
                  type="text"
                  name="last_name"
                  autoComplete="family-name"
                  required
                  defaultValue={lastName ?? ''}
                  label={formatMessage({
                    id: 'last_name',
                  })}
                />
                <FormField
                  className={styles.field}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  defaultValue={emailAddress?.emailAddress ?? ''}
                  label={formatMessage({
                    id: 'your_email',
                  })}
                  messages={{
                    typeMismatch: formatMessage({
                      id: 'message_invalid_email',
                    }),
                  }}
                />
                <FormField
                  className={styles.field}
                  type="tel"
                  name="phone_number"
                  autoComplete="tel"
                  defaultValue={
                    phoneNumber?.phoneNumber ??
                    defaultAddress?.phoneNumber ??
                    ''
                  }
                  label={formatMessage({
                    id: 'phone_number',
                  })}
                />
                {isMavalaCorporate && (
                  <FormField
                    className={styles.field}
                    required
                    type="text"
                    name="country"
                    autoComplete="country"
                    label={formatMessage({
                      id: 'country',
                    })}
                  />
                )}
                {OBJECT_MESSAGES.length > 0 ? (
                  <>
                    <input
                      type="hidden"
                      name="object"
                      value={formatMessage({
                        id: valueSelect,
                      })}
                    />
                    <FormField
                      className={styles.field}
                      name="object_id"
                      required
                      label={formatMessage({
                        id: 'message_subject',
                      })}
                      asChild
                      onChange={handleChange}
                    >
                      <select>
                        {OBJECT_MESSAGES?.map((object, index) => (
                          <option
                            value={object}
                            key={`${object[index]}-${index + 1}`}
                          >
                            {formatMessage({
                              id: object,
                            })}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </>
                ) : (
                  <FormField
                    className={styles.field}
                    type="text"
                    name="object"
                    required
                    label={formatMessage({
                      id: 'message_subject',
                      defaultMessage: 'Objet du message',
                    })}
                  />
                )}
                <FormField
                  label="Votre message"
                  name="message"
                  asChild
                  className={styles.field}
                >
                  <textarea />
                </FormField>
              </div>
              <div className={styles.checkboxs}>
                <FormCheckbox
                  className={styles.checkbox}
                  required
                  name="accept"
                  label={formatMessage(
                    {
                      id: 'accept_privacy_policy',
                    },
                    {
                      linkPrivacyPolicy: (
                        <Link
                          to={`${pathWithLocale}/privacy-policy`}
                          key={'privacy-policy'}
                          variant="animated-underline-reverse"
                          size="sm"
                        >
                          {privacyPolicy?.title.toLocaleLowerCase()}
                        </Link>
                      ),
                    },
                  )}
                />
                {isMavalaFrance && (
                  <FormCheckbox
                    className={styles.checkbox}
                    name="newsletter_subscription"
                    label={formatMessage({
                      id: 'newsletter_subscription',
                    })}
                  />
                )}
              </div>
              <Button
                onClick={reset}
                type="submit"
                aria-busy={state.submitting}
                aria-disabled={state.submitting}
                className={styles.submit}
              >
                <ButtonEffect>
                  <FormattedMessage id="send_your_message" />
                </ButtonEffect>
              </Button>
            </>
          ) : (
            <Text color="medium" role="status" weight="light">
              <FormattedMessage id="contact_success" />
            </Text>
          )}
        </Form>
      </SidebarLayoutContent>
      <SidebarLayoutAside>
        {address && <RichText data={address?.value} />}
        {isDesktop && additionalInfo && (
          <RichText data={additionalInfo?.value} />
        )}
      </SidebarLayoutAside>
    </SidebarLayout>
  );
}
