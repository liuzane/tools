// 基础模块
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

// 变量
const vars = require('./vars');

// 编译器配置
const compilers = [
  {
    /**
     * 编译入口文件
     */
    pattern: 'index.ejs',
    options: {
      cwd: vars.PAGE_DIR,
    },
    compiler: async ({ filePath, globalLangData, globalData }) => {
      // 开始编译 EJS 文件
      await EJSCompiler({
        name: 'index',
        inputFilePath: filePath,
        outputFilePath: path.join(vars.OUTPUT_DIR, 'index.html'),
        langData: globalLangData['en'],
        injectData: {
          name: 'index',
          lang: 'en',
          langs: Object.keys(globalLangData),
          data: globalData,
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
      cwd: vars.PAGE_DIR,
    },
    compiler: async ({ filePath, globalLangData, globalData }) => {
      const dirPath = path.dirname(filePath);
      const dirName = path.basename(dirPath);
      // 加载页面语言文件
      const langFiles = glob.sync('*.json', { cwd: path.join(dirPath, vars.PAGE_LANGS_DIR) });
      const langNames = langFiles.map(langFile => langFile.replace(/\.json$/, ''));
      for (const langName of langNames) {
        const langData = await fs.readJson(path.join(dirPath, vars.PAGE_LANGS_DIR, `${langName}.json`), vars.UTF8_ENCODING);
        // 合并全局语言和页面语言
        const mergedLangData = Object.assign({}, globalLangData[langName], langData);
        // 开始编译 EJS 文件
        await EJSCompiler({
          name: dirName,
          inputFilePath: filePath,
          outputFilePath: path.join(vars.OUTPUT_DIR, langName, `${dirName}.html`),
          langData: mergedLangData,
          injectData: {
            name: dirName,
            lang: langName,
            langs: langNames,
            data: globalData,
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
      cwd: vars.JS_DIR,
      ignore: '_*.js',
    },
    compiler: async ({ filePath }) => {
      const outputFilePath = path.join(vars.OUTPUT_DIR, vars.OUTPUT_JS_DIR, path.basename(filePath));
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
      cwd: vars.PAGE_DIR,
    },
    compiler: async ({ filePath }) => {
      const outputFilePath = path.join(vars.OUTPUT_DIR, vars.OUTPUT_JS_DIR, `${path.basename(path.dirname(filePath))}.js`);
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
      cwd: vars.STYLES_DIR,
      ignore: '_*.styl',
    },
    compiler: async ({ filePath }) => {
      const fileName = path.basename(filePath).replace(/\.styl$/, '');
      const outputFilePath = path.join(vars.OUTPUT_DIR, vars.OUTPUT_CSS_DIR, `${fileName}.css`);
      // 开始编译 Stylus 文件
      await StylusCompiler({
        inputFilePath: filePath,
        outputFilePath,
        importPaths: [vars.STYLES_VARIABLES_FILE],
      });
    }
  },

  {
    /**
     * 编译页面 Stylus 文件
     */
    pattern: '*/index.styl',
    options: {
      cwd: vars.PAGE_DIR,
    },
    compiler: async ({ filePath }) => {
      const dirName = path.basename(path.dirname(filePath));
      await StylusCompiler({
        inputFilePath: filePath,
        outputFilePath: path.join(vars.OUTPUT_DIR, vars.OUTPUT_CSS_DIR, `${dirName}.css`),
        importPaths: [vars.STYLES_VARIABLES_FILE],
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
    data[fileName] = await fs.readJson(path.join(dir, file), vars.UTF8_ENCODING);
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
  const fileContent = await fs.readFile(inputFilePath, vars.UTF8_ENCODING);
  const langDataMap = flattenObject(langData);
  const htmlString = ejs.render(
    fileContent,
    {
      require,
      ...vars,
      dirPath,
      filePath: inputFilePath,
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
    minify: vars.mode === 'production', // 压缩输出文件
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
  const files = glob.sync('**/*', { cwd: vars.PUBLIC_DIR, nodir: true });
  for (const file of files) {
    const filePath = path.join(vars.PUBLIC_DIR, file);
    const outputPath = path.join(vars.OUTPUT_DIR, file);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.copy(filePath, outputPath);
  }
  console.log(chalk.gray(`\n📁 复制 ${files.length} 个文件到 ${vars.PUBLIC_DIR} `));
}


/**
 * 主构建函数
 * @returns {Promise<void>}
 */
async function builder() {
  console.log(chalk.blue('🚀 开始构建...'));

  try {
    // 清空输出目录
    await fs.emptyDir(vars.OUTPUT_DIR);

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
    const globalLangData = await loadJsonFileData(vars.GlOBAL_LANGS_DIR);

    // 加载数据文件夹下的所有JSON文件数据
    console.log(chalk.gray(`\n📄 加载数据文件夹JSON文件数据...`));
    const globalData = await loadJsonFileData(vars.GlOBAL_DATA_DIR);

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

module.exports = builder;