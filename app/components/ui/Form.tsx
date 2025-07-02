import {cn} from '~/lib/utils';
import type {
  FormControlProps,
  FormFieldProps,
  FormMessageProps,
} from '@radix-ui/react-form';
import {Control, Field, Label, Message, Root} from '@radix-ui/react-form';
import React, {forwardRef} from 'react';
import {useIntl, FormattedMessage} from 'react-intl';
import {Text} from './Text';
import styles from './Form.module.css';

export const Form = Root;

const DEFAULT_MESSAGES: Partial<
  Record<Extract<FormMessageProps['match'], string>, string>
> = {
  typeMismatch: 'message_type_mismatch', // 'Veuillez entrer une valeur valide'
  valueMissing: 'message_value_missing', // 'Ce champ est obligatoire'
};

export const FormField = forwardRef<
  React.ComponentRef<typeof Control>,
  Pick<FormFieldProps, 'name'> &
    FormControlProps & {
      label?: string;
      description?: string | React.ReactNode;
      messages?: Partial<
        Record<Extract<FormMessageProps['match'], string>, string>
      >;
      variant?: 'stack' | 'float' | 'newsletter';
    }
>(function FormField(
  {
    name,
    label,
    description,
    messages,
    className,
    required,
    variant = 'float',
    ...props
  },
  ref,
) {
  const {formatMessage} = useIntl();

  return (
    <Field
      name={name}
      className={cn(styles.field, className)}
      data-variant={variant}
    >
      {label && (
        <Label>
          {label}
          {required && (
            <span aria-hidden="true">
              {`(${formatMessage({
                id: 'required',
              })})`}
            </span>
          )}
        </Label>
      )}
      <Control
        placeholder={variant === 'stack' ? undefined : label}
        required={required}
        ref={ref}
        {...props}
      />
      {description && (
        <FormMessage variant="description">{description}</FormMessage>
      )}
      {Object.entries({...DEFAULT_MESSAGES, ...messages}).map(
        ([match, message]) => (
          <FormMessage match={match as FormMessageProps['match']} key={match}>
            <FormattedMessage id={message} />
          </FormMessage>
        ),
      )}
    </Field>
  );
});

export const FormCheckbox = forwardRef<
  React.ComponentRef<typeof Control>,
  Pick<FormFieldProps, 'name'> &
    FormControlProps & {
      label: string | React.ReactNode;
      messages?: Partial<
        Record<Extract<FormMessageProps['match'], string>, string>
      >;
    }
>(function FormCheckbox({name, label, messages, className, ...props}, ref) {
  return (
    <Field name={name} className={cn(styles.checkbox, className)}>
      <div className={styles['checkbox-container']}>
        <Control type="checkbox" ref={ref} {...props} />
        <Text asChild size="sm" weight="light">
          <Label>{label}</Label>
        </Text>
      </div>
      {Object.entries({...DEFAULT_MESSAGES, ...messages}).map(
        ([match, message]) => (
          <FormMessage match={match as FormMessageProps['match']} key={match}>
            <FormattedMessage id={message} />
          </FormMessage>
        ),
      )}
    </Field>
  );
});

export const FormMessage = forwardRef<
  React.ComponentRef<typeof Message>,
  React.ComponentProps<typeof Message> & {
    variant?: 'description' | 'status';
  }
>(function FormMessage({match, variant = 'status', children, ...props}, ref) {
  return (
    <Message
      className={styles.message}
      match={match}
      data-variant={variant}
      ref={ref}
      asChild
      {...props}
    >
      <div>{children}</div>
    </Message>
  );
});
