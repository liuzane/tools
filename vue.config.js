const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',

  outputDir: 'docs',

  productionSourceMap: false,

  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      }
    },
  },

  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Tools',
    },

    'credit-card-amount': {
      entry: 'src/pages/credit-card-amount/main.js',
      template: 'public/index.html',
      filename: 'credit-card-amount.html',
      title: 'Credit Card Amount',
    },

    'mcc-query': {
      entry: 'src/pages/mcc-query/main.js',
      template: 'public/index.html',
      filename: 'mcc-query.html',
      title: 'MCC Query',
    },
  },
};