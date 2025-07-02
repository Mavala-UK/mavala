import type {SlugRule} from 'sanity';

const MAX_LENGTH = 96;

export const validateSlug = (Rule: SlugRule) => {
  return Rule.required().custom((value) => {
    const currentSlug = value && value.current;
    if (!currentSlug) {
      return true;
    }

    if (currentSlug.length >= MAX_LENGTH) {
      return `Doit contenir moins de ${MAX_LENGTH} caractères`;
    }

    return true;
  });
};
