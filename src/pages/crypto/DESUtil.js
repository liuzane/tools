const crypto = require('crypto');

const PASSWORD_CRYPT_KEY = '12345678';

/**
 * 加密（等价 Java encrypt(String)）
 * 入参: 普通字符串
 * 出参: HEX大写字符串
 */
function encrypt(text) {
  const key = Buffer.from(PASSWORD_CRYPT_KEY, 'utf8');

  const cipher = crypto.createCipheriv('des-ecb', key, null);
  cipher.setAutoPadding(true);

  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex').toUpperCase(); // == byte2hex
}


/**
 * 解密（等价 Java decrypt(String)）
 * 入参: HEX字符串
 * 出参: 普通字符串
 */
function decrypt(hexStr) {
  const key = Buffer.from(PASSWORD_CRYPT_KEY, 'utf8');

  const encryptedBuffer = Buffer.from(hexStr, 'hex'); // == hex2byte

  const decipher = crypto.createDecipheriv('des-ecb', key, null);
  decipher.setAutoPadding(true);

  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

/* ========= CLI 解析 ========= */

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log(`
用法:
  加密: node DESUtil.js -encrypt 123
  解密: node DESUtil.js -decrypt 8B6C9F...
`);
    process.exit(0);
}

const flag = args[0];
const value = args[1];

if (flag === '-encrypt') {
    console.log("加密结果:", encrypt(value));
} else if (flag === '-decrypt') {
    console.log("解密结果:", decrypt(value));
} else {
    console.log("未知参数");
}

/**
 * 加密用法：
 * node DESUtil.js -encrypt 123
 * 
 * 解密用法：
 * node DESUtil.js -decrypt 8B6C9F...
 */