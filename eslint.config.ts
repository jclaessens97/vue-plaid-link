import antfu from '@antfu/eslint-config';

export default antfu(
  {
    ignores: ['**/examples/**/*'],

    stylistic: {
      semi: true,
    },
    typescript: true,
    vue: {
      overrides: {
        // Allow other casing for custom events (e.g. change:foobar)
        'vue/custom-event-name-casing': 'off',

        // Set SFC tag order to template, script, style
        'vue/block-order': [
          'error',
          {
            order: [['template', 'script'], 'style'],
          },
        ],
      },
    },
  },
  {
    rules: {
      // Always require curly braces
      'curly': ['error', 'all'],

      // Always require parens around arrow function arguments
      'style/arrow-parens': ['error', 'always'],
    },
  },
);
