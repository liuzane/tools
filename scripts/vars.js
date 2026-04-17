// 基础模块
const path = require('path');

let mode = 'production';
// 命令行参数处理
if (process.argv.includes('--development') || process.argv.includes('-d')) {
  mode = 'development';
} else {
  mode = 'production';
}

// 常量
const SRC_DIR = path.resolve(__dirname, '../src');
const OUTPUT_DIR = path.resolve(__dirname, '../dist');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const GlOBAL_LANGS_DIR = path.join(SRC_DIR, 'langs');
const GlOBAL_DATA_DIR = path.join(SRC_DIR, 'data');
const PAGE_DIR = path.join(SRC_DIR, 'pages');
const JS_DIR = path.join(SRC_DIR, 'js');
const STYLES_DIR = path.join(SRC_DIR, 'styles');
const STYLES_VARIABLES_FILE = path.join(STYLES_DIR, '_variables.styl');
const PAGE_LANGS_DIR = 'langs';
const OUTPUT_JS_DIR = 'js';
const OUTPUT_CSS_DIR = 'css';
const UTF8_ENCODING = 'utf8';
const PUBLIC_URL = '/tools';
const HOSTNAME = 'localhost';
const PORT = 7001;
const ORIGIN_URL = mode === 'development' ? `http://${HOSTNAME}:${PORT}` : `https://liuzane.github.io${PUBLIC_URL}`;

module.exports = {
  mode,
  SRC_DIR,
  OUTPUT_DIR,
  PUBLIC_DIR,
  GlOBAL_LANGS_DIR,
  GlOBAL_DATA_DIR,
  PAGE_DIR,
  JS_DIR,
  STYLES_DIR,
  STYLES_VARIABLES_FILE,
  PAGE_LANGS_DIR,
  OUTPUT_JS_DIR,
  OUTPUT_CSS_DIR,
  UTF8_ENCODING,
  PUBLIC_URL,
  HOSTNAME,
  PORT,
  ORIGIN_URL,
};
