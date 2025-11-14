const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

global.__JEST__ = true;

global.renderHTMLByEJS = function(options) {
  const dir = options.dir;
  const filePath = options.filePath;
  const data = options.data || {};
  const EJS_TEMPLATE_DATA = {
    mode: 'production',
    ORIGIN_URL: 'https://liuzane.github.io/tools',
    OUTPUT_JS_DIR: '/js',
    OUTPUT_CSS_DIR: '/css',
    PUBLIC_URL: '/tools',
    name: 'index',
    menus: [
      {
        title: 'test.name',
        url: '/test.html',
      }
    ],
    lang: 'en',
    langs: ['en'],
    langDataMap: {}
  };
  const absolutePath = path.resolve(dir, filePath);
  const templateHTML = fs.readFileSync(absolutePath, 'utf8');
  return ejs.render(
    templateHTML,
    { ...EJS_TEMPLATE_DATA, ...data },
    {
      root: path.dirname(absolutePath),
      filename: absolutePath,
    }
  )
}

HTMLCanvasElement.prototype.getContext = jest.fn(() => {
  return {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: [] })),
    putImageData: jest.fn(),
    createImageData: jest.fn(),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
    strokeRect: jest.fn(),
  };
});

HTMLCanvasElement.prototype.toDataURL = jest.fn(() => '');

global.URL = {
  createObjectURL: jest.fn(),
};