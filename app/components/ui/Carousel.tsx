import {Children, forwardRef} from 'react';
import {
  A11y,
  Autoplay,
  EffectFade,
  Mousewheel,
  Navigation,
  Pagination,
  FreeMode,
  Thumbs,
} from 'swiper/modules';
import type {SwiperProps} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import type {A11yOptions} from 'swiper/types';
import {useIntl} from 'react-intl';
import {cn} from '~/lib/utils';
import styles from './Carousel.module.css';

export const Carousel = forwardRef<
  React.ComponentRef<typeof Swiper>,
  SwiperProps & {
    slideTag?: string;
    variant?: 'product' | 'collection' | 'imageWithText';
  }
>(function Carousel(
  {
    wrapperTag = 'ul',
    slideTag = 'li',
    modules,
    a11y,
    autoplay,
    effect,
    mousewheel,
    navigation,
    pagination,
    freeMode,
    thumbs,
    className,
    variant,
    children,
    ...props
  },
  ref,
) {
  const {formatMessage} = useIntl();
  const defaultA11y = {
    prevSlideMessage: formatMessage({
      id: 'prev_slide',
    }),
    nextSlideMessage: formatMessage({
      id: 'prev_slide',
    }),
    firstSlideMessage: formatMessage({
      id: 'first_slide',
    }),
    lastSlideMessage: formatMessage({
      id: 'last_slide',
    }),
    paginationBulletMessage: `${formatMessage({
      id: 'go_to_slide',
    })} {{index}}`,
    slideRole: undefined,
    ...a11y,
  } satisfies A11yOptions;

  return (
    <Swiper
      data-variant={variant}
      className={cn(styles.root, className)}
      wrapperTag={wrapperTag}
      modules={[
        A11y,
        ...(autoplay ? [Autoplay] : []),
        ...(effect === 'fade' ? [EffectFade] : []),
        ...(mousewheel ? [Mousewheel] : []),
        ...(navigation ? [Navigation] : []),
        ...(pagination ? [Pagination] : []),
        ...(freeMode ? [FreeMode] : []),
        ...(thumbs ? [Thumbs] : []),
        ...(modules ?? []),
      ]}
      a11y={defaultA11y}
      autoplay={autoplay}
      effect={effect}
      mousewheel={mousewheel}
      navigation={navigation}
      pagination={pagination}
      freeMode={freeMode}
      thumbs={thumbs}
      ref={ref}
      {...props}
    >
      {Children.toArray(children).map((child, index) => (
        <SwiperSlide tag={slideTag} key={index}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
});

export function CarouselWrapperButton({
  id,
  children,
}: {
  id: string;
  children: React.ReactElement<typeof Carousel>;
}) {
  return (
    <div className={styles['wrapper-button']}>
      {children}
      <button
        className={cn('swiper-button-next', styles['button-next'])}
        type="button"
        id={id ? `swiper-button-next-${id}` : undefined}
      />
    </div>
  );
}

export function CarouselNavigationButtons({
  id,
  className,
  size,
}: {
  id: string;
  className?: string;
  size?: 'sm';
}) {
  return (
    <div
      className={cn(styles['buttons-nav'], className)}
      data-size={size ?? ''}
    >
      <button
        type="button"
        className={cn(styles['button-nav'], 'swiper-button-prev')}
        id={id ? `swiper-button-prev-${id}` : undefined}
      />
      <button
        type="button"
        className={cn(styles['button-nav'], 'swiper-button-next')}
        id={id ? `swiper-button-next-${id}` : undefined}
      />
    </div>
  );
}
