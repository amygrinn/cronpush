const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ['src/styles'],
        },
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000/',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
      new MomentLocalesPlugin(),
    ],
  },
}
