const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
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
    amount: {
      entry: 'src/pages/amount/main.js',
      template: 'public/index.html',
      filename: 'amount.html',
      title: 'Amount',
      chunks: ['chunk-vendors', 'chunk-common', 'amount'],
    },
  },
};