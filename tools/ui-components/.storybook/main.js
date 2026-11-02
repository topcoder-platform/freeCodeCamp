module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y'
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
    }
  },
  framework: '@storybook/react-webpack5',
  webpackFinal: async config => {
    config.experiments = { ...config.experiments, typescript: false };
    config.module.rules.push({
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      type: 'javascript/auto',
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          configFile: false,
          presets: [
            require.resolve('@babel/preset-env'),
            [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
            require.resolve('@babel/preset-typescript')
          ]
        }
      }
    });
    // Keep the Tailwind/PostCSS pipeline from the old PostCSS addon.
    const cssRule = config.module.rules.find(
      rule => rule.test instanceof RegExp && rule.test.test('styles.css')
    );
    if (cssRule && Array.isArray(cssRule.use)) {
      cssRule.use.push({
        loader: require.resolve('postcss-loader'),
        options: { implementation: require('postcss') }
      });
    }
    return config;
  }
};
