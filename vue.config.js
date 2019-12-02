module.exports = {
  pages: {
    index: {
      entry: 'src/pages/index/main.js',
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