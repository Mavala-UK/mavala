/**
 * @type {import("stylelint").Config}
 */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-css-modules',
  ],
  plugins: ['stylelint-use-logical'],
  rules: {
    'csstools/use-logical': 'always',
    'no-descending-specificity': null,
    'selector-class-pattern': null,
  },
};
