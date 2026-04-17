// 基础模块
const http = require('http');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// 变量
const vars = require('./vars');

// 构建脚本
const builder = require('./builder');


let buildTimeout = null;

/**
 * 本地服务器
 * @returns {Promise<void>}
 */
async function devServer() {
  await builder();

  console.log(`\n👀 开始监听目录: ${vars.SRC_DIR}`);
  
  try {
    // 使用 fs.watch 监听目录（递归模式）
    const watcher = fs.watch(vars.SRC_DIR, { recursive: true }, (eventType, filename) => {
      if (filename) {
        const fullPath = path.join(vars.SRC_DIR, filename);
        console.log(`\n📁 检测到变化: ${eventType} -> ${fullPath}`);
        
        // 防抖：延迟构建，避免频繁触发
        if (buildTimeout) {
          clearTimeout(buildTimeout);
        }
        buildTimeout = setTimeout(builder, 500); // 延迟500ms
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
    const filePath = path.join(vars.OUTPUT_DIR, req.url === '/' ? 'index.html' : req.url);

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
  server.listen(vars.PORT, vars.HOSTNAME, () => {
    console.log(chalk.blue(`\n✅ 本地服务器已启动: http://${vars.HOSTNAME}:${vars.PORT}`));
  });
}

// 启动本地服务器
devServer();