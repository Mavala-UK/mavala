import {cn, slugify} from '~/lib/utils';
import {useProductView} from './ProductView';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {Text} from '../ui/Text';
import {RichText} from '../common/RichText';
import {assignIcons} from '../icons/accordion';
import styles from './ProductAccordion.module.css';

export function ProductAccordion({className}: {className?: string}) {
  const {product, selectedVariant} = useProductView();
  const productAccordions = product?.accordions?.references?.nodes ?? [];
  const selectedVariantAccordion = selectedVariant?.accordion?.reference;
  const selectedVariantAccordionTitle = slugify(
    selectedVariantAccordion?.title?.value!,
  );

  const accordions = [
    ...productAccordions.map((accordion) =>
      slugify(accordion?.title?.value ?? '') === selectedVariantAccordionTitle
        ? selectedVariantAccordion
        : accordion,
    ),
    ...(!productAccordions.some(
      (accordion) =>
        slugify(accordion?.title?.value ?? '') ===
        selectedVariantAccordionTitle,
    ) && selectedVariantAccordionTitle
      ? [selectedVariantAccordion]
      : []),
  ];

  if (!accordions) {
    return null;
  }

  const iconMap = assignIcons(
    accordions?.map((a) => a?.title?.value) ?? [],
  );

  return (
    <Accordion className={cn(styles.root, className)} type="multiple">
      {accordions?.map((accordion) => {
        const {title, text} = accordion ?? {};
        const icon = iconMap.get(title?.value ?? '') ?? null;

        return (
          <AccordionItem value={accordion?.id!} key={accordion?.id}>
            <AccordionHeader asChild>
              <h2>
                <AccordionTrigger>
                  <span className={styles['trigger-inner']}>
                    {icon && <span data-testid="accordion-icon" className={styles.icon}>{icon}</span>}
                    {title?.value}
                  </span>
                </AccordionTrigger>
              </h2>
            </AccordionHeader>
            <AccordionContent>
              <Text size="sm" asChild>
                <RichText data={text?.value} />
              </Text>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
