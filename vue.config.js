const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',

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
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },

    'credit-card-amount': {
      entry: 'src/pages/credit-card-amount/main.js',
      template: 'public/index.html',
      filename: 'credit-card-amount.html',
      title: 'Credit Card Amount',
      chunks: ['chunk-vendors', 'chunk-common', 'credit-card-amount'],
    },

    'mcc-query': {
      entry: 'src/pages/mcc-query/main.js',
      template: 'public/index.html',
      filename: 'mcc-query.html',
      title: 'Mcc Query',
      chunks: ['chunk-vendors', 'chunk-common', 'mcc-query'],
    },
  },
};