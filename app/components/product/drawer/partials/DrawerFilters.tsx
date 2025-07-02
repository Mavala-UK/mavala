import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Checkbox from '@radix-ui/react-checkbox';
import {cn} from '~/lib/utils';
import {DialogClose} from '@radix-ui/react-dialog';
import {useIntl, FormattedMessage} from 'react-intl';
import {useProductViewDrawer} from '../ProductViewDrawer';
import {
  Drawer,
  DrawerTitle,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
  DrawerBody,
  DrawerFooter,
} from '~/components/ui/Drawer';
import {Text} from '~/components/ui/Text';
import {Button, ButtonEffect} from '~/components/ui/Button';
import styles from './DrawerFilters.module.css';

type FiltersValue = {
  name: string;
  finishes?: string[];
  protectors?: string[];
  show: boolean;
};

export function DrawerFilters({className}: {className?: string}) {
  const {formatMessage} = useIntl();
  const {products, filters, setFilters} = useProductViewDrawer();

  const variants = products.flatMap((product) => product?.variants?.nodes);

  const finishes = Array.from(
    new Set(
      variants?.flatMap((variant) => variant?.finish?.value).filter(Boolean),
    ),
  );

  const hasProtector = variants.some(
    (variant) => variant?.protector?.value === 'true',
  );

  const filtersValues: FiltersValue[] = [
    {
      name: formatMessage({
        id: 'finishes',
      }),
      finishes,
      show: finishes?.length! > 0,
    },
    {
      name: formatMessage({
        id: 'protector',
      }),
      protectors: ['true', 'false'],
      show: hasProtector,
    },
  ];

  const handleCheckedChange = (
    value: string,
    checked: boolean | 'indeterminate',
  ) => {
    setFilters((prevState) => ({
      ...prevState,
      finishes: checked
        ? [...prevState.finishes, value]
        : prevState.finishes.filter((item) => item !== value),
    }));
  };

  const handleValueChange = (value: string) => {
    setFilters((prevState) => ({
      ...prevState,
      hasProtector: value === 'true',
    }));
  };

  const handleResetFilters = (filter: FiltersValue) => {
    setFilters((prevState) => ({
      ...prevState,
      finishes: filter.finishes ? [] : prevState.finishes,
      hasProtector: filter.protectors ? null : prevState.hasProtector,
    }));
  };

  return (
    (finishes.length || hasProtector) && (
      <div className={cn(styles.root, className)}>
        {filtersValues.map((filter) => {
          const {finishes, protectors, show: showFilter} = filter ?? {};
          const {finishes: selectedFinishes, hasProtector} = filters ?? {};

          return (
            showFilter && (
              <Drawer key={filter.name}>
                <Text size="sm" weight="light" asChild>
                  <DrawerTrigger className={styles.trigger}>
                    {`${filter.name} ${
                      finishes && selectedFinishes.length!
                        ? `(${selectedFinishes?.length})`
                        : ''
                    }`}
                  </DrawerTrigger>
                </Text>
                <DrawerContent
                  animationOrigin="bottom"
                  className={styles.content}
                >
                  <fieldset>
                    <DrawerHeader>
                      <Text weight="medium" size="sm" asChild>
                        <DrawerTitle asChild>
                          <legend>{filter.name}</legend>
                        </DrawerTitle>
                      </Text>
                      <DrawerClose />
                    </DrawerHeader>
                    <DrawerBody className={styles.body}>
                      {(() => {
                        switch (true) {
                          case Boolean(finishes):
                            return (
                              <div className={styles.filters}>
                                {finishes?.map((value) => (
                                  <Checkbox.Root
                                    key={value}
                                    value={value}
                                    checked={selectedFinishes.includes(value)}
                                    onCheckedChange={(checked) =>
                                      handleCheckedChange(value, checked)
                                    }
                                    className={styles.filter}
                                  >
                                    <Text asChild size="sm" weight="light">
                                      <label>{value}</label>
                                    </Text>
                                  </Checkbox.Root>
                                ))}
                              </div>
                            );
                          case Boolean(protectors):
                            return (
                              <RadioGroup.Root
                                className={styles.filters}
                                onValueChange={handleValueChange}
                                value={String(hasProtector) || ''}
                              >
                                {protectors?.map((protector) => (
                                  <Text
                                    asChild
                                    size="sm"
                                    weight="light"
                                    key={protector}
                                  >
                                    <RadioGroup.Item
                                      value={protector}
                                      className={styles.filter}
                                      checked={
                                        String(hasProtector) === protector
                                      }
                                    >
                                      {(() => {
                                        switch (protector) {
                                          case 'true':
                                            return (
                                              <FormattedMessage id="with" />
                                            );
                                          case 'false':
                                            return (
                                              <FormattedMessage id="without" />
                                            );
                                        }
                                      })()}
                                    </RadioGroup.Item>
                                  </Text>
                                ))}
                              </RadioGroup.Root>
                            );
                        }
                      })()}
                    </DrawerBody>
                    <DrawerFooter className={styles.footer}>
                      <Button
                        theme="light"
                        className={styles.button}
                        onClick={() => handleResetFilters(filter)}
                      >
                        <FormattedMessage id="reset" />
                      </Button>
                      <DialogClose asChild>
                        <Button className={styles.button}>
                          <ButtonEffect>
                            <FormattedMessage id="validate" />
                          </ButtonEffect>
                        </Button>
                      </DialogClose>
                    </DrawerFooter>
                  </fieldset>
                </DrawerContent>
              </Drawer>
            )
          );
        })}
      </div>
    )
  );
}
