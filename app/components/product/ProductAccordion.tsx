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

  return (
    <Accordion className={cn(styles.root, className)} type="multiple">
      {accordions?.map((accordion) => {
        const {title, text} = accordion ?? {};

        return (
          <AccordionItem value={accordion?.id!} key={accordion?.id}>
            <AccordionHeader asChild>
              <h2>
                <AccordionTrigger>{title?.value}</AccordionTrigger>
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
