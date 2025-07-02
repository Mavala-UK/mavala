import postcssPresetEnv from 'postcss-preset-env';
import postcssAssignLayer from 'postcss-assign-layer';

/**
 * @type {import("postcss-load-config").Config}
 */
export default {
  plugins: [
    postcssPresetEnv({
      stage: 0,
      features: {
        'any-link-pseudo-class': false,
        'color-functional-notation': false,
        'custom-properties': false,
        'gap-properties': false,
        'is-pseudo-class': false,
        'logical-properties-and-values': false,
        'not-pseudo-class': false,
        'overflow-wrap-property': false,
        'place-properties': false,
      },
    }),
    postcssAssignLayer([
      {
        include: './app/components/ui/*.module.css',
        layerName: 'ui',
      },
    ]),
  ],
};
