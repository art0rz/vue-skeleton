module.exports = ({ config }) => webpackConfig => ({
  ...webpackConfig,
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: process.env.HOST || '0.0.0.0',
    port: config.devServer.port,
    open: false,
    proxy: config.devServer.proxyTable,
    // quiet: true,
    https: config.devServer.useHttps,
  },
});
