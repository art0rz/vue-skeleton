module.exports = () => webpackConfig => ({
  ...webpackConfig,
  node: false,
});
