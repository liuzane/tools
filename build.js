// 基础模块
const http = require('http');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');

// 编译器模块
const ejs = require('ejs');
const esbuild = require('esbuild');
const stylus = require('stylus');

// 插件模块
const minify = require('html-minifier').minify;
const sprintf = require('sprintf-js').sprintf;

let mode = 'production';
// 命令行参数处理
if (process.argv.includes('--development') || process.argv.includes('-d')) {
  mode = 'development';
} else {
  mode = 'production';
}

// 常量
const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
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

// 编译器配置
const compilers = [
  {
    /**
     * 编译入口文件
     */
    pattern: 'index.ejs',
    options: {
      cwd: PAGE_DIR,
    },
    compiler: async ({ filePath, globalLangData, globalData }) => {
      // 开始编译 EJS 文件
      await EJSCompiler({
        name: 'index',
        inputFilePath: filePath,
        outputFilePath: path.join(DIST_DIR, 'index.html'),
        langData: globalLangData['en'],
        injectData: {
          name: 'index',
          menus: globalData.menus,
          lang: 'en',
          langs: Object.keys(globalLangData),
        },
      });
    }
  },

  {
    /**
     * 编译页面入口 EJS 文件
     */
    pattern: '*/index.ejs',
    options: {
      cwd: PAGE_DIR,
    },
    compiler: async ({ filePath, globalLangData, globalData }) => {
      const dirPath = path.dirname(filePath);
      const dirName = path.basename(dirPath);
      // 加载页面 JSON 文件
      const localJsonFiles = glob.sync('*.json', { cwd: dirPath });
      const localJsonDataMap = {};
      for (const localJsonFile of localJsonFiles) {
        const localJsonData = await fs.readJson(path.join(dirPath, localJsonFile), UTF8_ENCODING);
        localJsonDataMap[localJsonFile.replace(/\.json$/, '')] = localJsonData;
      }
      // 加载页面语言文件
      const langFiles = glob.sync('*.json', { cwd: path.join(dirPath, PAGE_LANGS_DIR) });
      const langNames = langFiles.map(langFile => langFile.replace(/\.json$/, ''));
      for (const langName of langNames) {
        const langData = await fs.readJson(path.join(dirPath, PAGE_LANGS_DIR, `${langName}.json`), UTF8_ENCODING);
        // 合并全局语言和页面语言
        const mergedLangData = Object.assign({}, globalLangData[langName], langData);
        // 开始编译 EJS 文件
        await EJSCompiler({
          name: dirName,
          inputFilePath: filePath,
          outputFilePath: path.join(DIST_DIR, langName, `${dirName}.html`),
          langData: mergedLangData,
          injectData: {
            name: dirName,
            menus: globalData.menus,
            data: localJsonDataMap,
            lang: langName,
            langs: langNames
          },
        });
      }
    }
  },

  {
    /**
     * 编译全局 JS 文件
     */
    pattern: '*.js',
    options: {
      cwd: JS_DIR,
      ignore: '_*.js',
    },
    compiler: async ({ filePath }) => {
      const outputFilePath = path.join(DIST_DIR, OUTPUT_JS_DIR, path.basename(filePath));
      // 开始编译 JS 文件
      await JSCompiler({
        inputFilePath: filePath,
        outputFilePath,
      });
    }
  },

  {
    /**
     * 编译页面入口 JS 文件
     */
    pattern: '*/index.js',
    options: {
      cwd: PAGE_DIR,
    },
    compiler: async ({ filePath }) => {
      const outputFilePath = path.join(DIST_DIR, OUTPUT_JS_DIR, `${path.basename(path.dirname(filePath))}.js`);
      // 开始编译 JS 文件
      await JSCompiler({
        inputFilePath: filePath,
        outputFilePath,
      });
    }
  },

  {
    /**
     * 编译全局 Stylus 文件
     */
    pattern: '*.styl',
    options: {
      cwd: STYLES_DIR,
      ignore: '_*.styl',
    },
    compiler: async ({ filePath }) => {
      const fileName = path.basename(filePath).replace(/\.styl$/, '');
      const outputFilePath = path.join(DIST_DIR, OUTPUT_CSS_DIR, `${fileName}.css`);
      // 开始编译 Stylus 文件
      await StylusCompiler({
        inputFilePath: filePath,
        outputFilePath,
        importPaths: [STYLES_VARIABLES_FILE],
      });
    }
  },

  {
    /**
     * 编译页面 Stylus 文件
     */
    pattern: '*/index.styl',
    options: {
      cwd: PAGE_DIR,
    },
    compiler: async ({ filePath }) => {
      const dirName = path.basename(path.dirname(filePath));
      await StylusCompiler({
        inputFilePath: filePath,
        outputFilePath: path.join(DIST_DIR, OUTPUT_CSS_DIR, `${dirName}.css`),
        importPaths: [STYLES_VARIABLES_FILE],
      });
    },
  },
];


/**
 * 加载JSON文件数据
 * @param {string} dir - JSON文件所在目录
 * @returns {object} 包含所有JSON文件数据的对象
 */
async function loadJsonFileData(dir) {
  const langFiles = glob.sync('*.json', { cwd: dir });
  const data = {};
  for (const file of langFiles) {
    const fileName = file.replace(/\.json$/, '');
    data[fileName] = await fs.readJson(path.join(dir, file), UTF8_ENCODING);
  }
  return data;
}


/**
 * 编译 EJS 文件
 * @param {string} name - 编译任务名称
 * @param {string} inputFilePath - 输入 EJS 文件路径
 * @param {string} outputFilePath - 输出 HTML 文件路径
 * @param {object} injectData - 注入到模板中的数据
 * @returns {Promise<void>}
 */
async function EJSCompiler({ name, inputFilePath, outputFilePath, langData, injectData }) {
  const dirPath = path.dirname(inputFilePath);
  const fileContent = await fs.readFile(inputFilePath, UTF8_ENCODING);
  const langDataMap = flattenObject(langData);
  const htmlString = ejs.render(
    fileContent,
    {
      mode,
      ORIGIN_URL,
      OUTPUT_JS_DIR,
      OUTPUT_CSS_DIR,
      PUBLIC_URL,
      langDataMap,
      _t: (key, ...args) => langDataMap[key] ? sprintf(langDataMap[key], ...args) : key,
      ...injectData,
    },
    {
      root: dirPath,
      filename: inputFilePath,
    }
  );
  // 压缩 HTML 字符串
  const compressedHtml = minifyHtml(htmlString);
  // 写入 HTML 文件
  await fs.ensureFile(outputFilePath);
  await fs.writeFile(outputFilePath, compressedHtml);
  // console.log(chalk.green(`✓ EJS${name ? ` ${name}` : ''}: ${inputFilePath} → ${outputFilePath}`));
}


/**
 * 压缩HTML字符串
 * @param {string} htmlString - 要压缩的HTML字符串
 * @returns {string} 压缩后的HTML字符串
 */
function minifyHtml(htmlString) {
  return minify(htmlString, {
    collapseWhitespace: true,   // 移除空白字符
    removeComments: true,       // 移除注释
    minifyCSS: true,            // 压缩内联CSS
    minifyJS: true              // 压缩内联JavaScript
  });
}


/**
 * 编译页面 JS 文件
 * @param {string} filePath - 输入 JS 文件路径
 * @param {string} outputFilePath - 输出 JS 文件路径
 * @param {object} esbuildOptions - ESBuild 选项
 * @returns {Promise<void>}
 */
async function JSCompiler({ inputFilePath, outputFilePath, ...esbuildOptions }) {
  await esbuild.build({
    entryPoints: [inputFilePath], // 入口文件
    outfile: outputFilePath, // 输出文件路径
    platform: 'browser', // 目标平台为浏览器
    format: 'cjs', // 输出格式为 CommonJS 模块
    bundle: true, // 打包所有依赖到一个文件
    minify: mode === 'production', // 压缩输出文件
    treeShaking: true, // 启用代码摇树优化
    define: {
      __JEST__: 'false', // 定义 __JEST__ 为 false，用于在生产环境中剔除代码
    },
    ...esbuildOptions,
  });
  // console.log(chalk.green(`✓ ESBuild: ${inputFilePath} → ${outputFilePath}`));
}


/**
 * 编译页面 Stylus 文件
 * @param {string} inputFilePath - 输入 Stylus 文件路径
 * @param {string} outputFilePath - 输出 CSS 文件路径
 * @returns {Promise<void>}
 */
async function StylusCompiler({ inputFilePath, outputFilePath, importPaths = [] }) {
  const data = await fs.readFile(inputFilePath, 'utf8');
  return new Promise((resolve, reject) => {
    const stylusInstance = stylus(data);
    stylusInstance.set('filename', inputFilePath);
    stylusInstance.set('compress', true);
    for (const importPath of importPaths) {
      stylusInstance.import(importPath);
    }
    stylusInstance.render(async (err, css) => {
      if (err) {
        console.error(chalk.red(`✗ Stylus error in ${inputFilePath}: ${err.message}`));
        reject(err);
        return;
      }
      await fs.ensureFile(outputFilePath);
      await fs.writeFile(outputFilePath, css);
      // console.log(chalk.green(`✓ Stylus: ${inputFilePath} → ${outputFilePath}`));
      resolve();
    });
  });
}

/**
 * 递归展平嵌套对象的键
 * @param {object} data - 要展平的嵌套对象
 * @param {object} [obj={}] - 用于存储展平结果的对象
 * @param {string} [parent=''] - 当前键的父键路径
 * @returns {object} 展平后的对象
 */
function flattenObject(data, obj = {}, parent = '') {
  Object.keys(data).forEach(key => {
    const item = data[key];
    if (typeof item === 'object') {
      flattenObject(item, obj, `${parent + key}.`);
    } else {
      obj[parent + key] = item;
    }
  });
  return obj;
}


/**
 * 复制公共文件到输出目录
 * @returns {Promise<void>}
 */
async function copyPublicFiles() {
  const files = glob.sync('**/*', { cwd: PUBLIC_DIR, nodir: true });
  for (const file of files) {
    const filePath = path.join(PUBLIC_DIR, file);
    const outputPath = path.join(DIST_DIR, file);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.copy(filePath, outputPath);
  }
  console.log(chalk.gray(`\n📁 复制 ${files.length} 个文件到 ${PUBLIC_DIR} `));
}


/**
 * 主构建函数
 * @returns {Promise<void>}
 */
async function build() {
  console.log(chalk.blue('🚀 开始构建...'));

  try {
    // 清空输出目录
    await fs.emptyDir(DIST_DIR);

    // 查找所有需要处理的文件
    const files = [];
    const compilerMap = {};

    for (const [index, item] of compilers.entries()) {
      const matchedPaths = glob.sync(item.pattern, item.options);
      matchedPaths.forEach((path) => {
        files.push({
          compilerKey: index,
          cwd: item.options?.cwd,
          path,
        });
      });
      compilerMap[index] = item.compiler;
    }

    // 加载全局语言文件数据
    console.log(chalk.gray(`\n🌐 加载全局语言文件数据...`));
    const globalLangData = await loadJsonFileData(GlOBAL_LANGS_DIR);

    // 加载数据文件夹下的所有JSON文件数据
    console.log(chalk.gray(`\n📄 加载数据文件夹JSON文件数据...`));
    const globalData = await loadJsonFileData(GlOBAL_DATA_DIR);

    console.log(chalk.gray(`\n📁 发现 ${files.length} 个文件需要处理`));

    // 处理每个文件
    for (const file of files) {
      const filePath = file.cwd ? path.join(file.cwd, file.path) : file.path;

      // console.log(chalk.gray(`\n🔍 处理文件: ${filePath}`));

      await compilerMap[file.compilerKey]({
        filePath,
        globalLangData,
        globalData,
      });
    }

    console.log(chalk.green(`✓ ${files.length} 个文件处理完成`));

    // 复制其他文件（如图片、字体等）
    await copyPublicFiles();

    console.log(chalk.blue('\n✅ 构建完成！'));
  } catch (error) {
    console.error(chalk.red('\n❌ 构建失败:'), error);
  }
}


let buildTimeout = null;


/**
 * 本地服务器
 * @returns {Promise<void>}
 */
async function devServer() {
  await build();

  console.log(`\n👀 开始监听目录: ${SRC_DIR}`);
  
  try {
    // 使用 fs.watch 监听目录（递归模式）
    const watcher = fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
      if (filename) {
        const fullPath = path.join(SRC_DIR, filename);
        console.log(`\n📁 检测到变化: ${eventType} -> ${fullPath}`);
        
        // 防抖：延迟构建，避免频繁触发
        if (buildTimeout) {
          clearTimeout(buildTimeout);
        }
        buildTimeout = setTimeout(build, 500); // 延迟500ms
      }
    });

    // 错误处理
    watcher.on('error', (error) => {
      console.error('❌ 监听错误:', error);
    });
  } catch (error) {
    console.error('❌ 初始化监听失败:', error);
    throw error;
  }

  // 创建HTTP服务器
  const server = http.createServer((req, res) => {
    // 只处理 GET 请求
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>405 - Method Not Allowed</h1>`);
      return;
    }

    // 构建静态文件绝对路径
    const filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

    // 检查文件是否存在
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>404 - Not Found</h1>`);
        return;
      }

      // 根据文件扩展名设置 MIME 类型
      const extname = path.extname(filePath);
      const mimeTypes = {
        // HTML
        '.html': 'text/html; charset=utf-8',
        '.htm': 'text/html; charset=utf-8',

        // CSS
        '.css': 'text/css; charset=utf-8',

        // JavaScript
        '.js': 'application/javascript; charset=utf-8',
        '.mjs': 'application/javascript; charset=utf-8',

        // 图片
        '.ico': 'image/x-icon',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp',

        // 字体
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',

        // 其他
        '.json': 'application/json',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain; charset=utf-8',
        '.xml': 'application/xml'
      };

      const contentType = mimeTypes[extname] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);

      // 读取文件并返回
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);

      readStream.on('error', (error) => {
        console.error('文件读取错误:', error);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>500 - Internal Server Error</h1>`);
      });
    });
  });

  // 启动服务器，开始监听指定端口
  server.listen(PORT, HOSTNAME, () => {
    console.log(chalk.blue(`\n✅ 本地服务器已启动: http://${HOSTNAME}:${PORT}`));
  });
}

// 命令行参数处理
if (process.argv.includes('--development') || process.argv.includes('-d')) {
  devServer();
} else {
  build();
}