const ghpages = require('gh-pages');
const { OUTPUT_DIR } = require('./vars');

ghpages.publish(OUTPUT_DIR, {
  message: 'Auto-generated commit',
  branch: 'gh-pages',
  repo: 'https://github.com/liuzane/tools.git',
  add: false,
  history: false
}, function (err) {
  if (err) {
    console.error('Error publishing to GitHub Pages:', err);
  } else {
    console.log('\x1b[32mSuccessfully published to GitHub Pages!\x1b[0m');
  }
});

