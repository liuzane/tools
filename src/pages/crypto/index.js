'use strict';

// 引入 CryptoJS
const CryptoJS = require('crypto-js');
console.log('CryptoJS', CryptoJS);
// DOM元素引用
let algorithmSelect = null;
let modeRadios = null;
let keyInput = null;
let inputText = null;
let outputText = null;
let btnExecute = null;
let btnCopy = null;
let btnClear = null;
let errorMessage = null;

// 初始化页面
function init() {
  // 获取DOM元素
  algorithmSelect = document.getElementById('algorithm-select');
  modeRadios = document.querySelectorAll('input[name="mode"]');
  keyInput = document.getElementById('key-input');
  inputText = document.getElementById('input-text');
  outputText = document.getElementById('output-text');
  btnExecute = document.getElementById('btn-execute');
  btnCopy = document.getElementById('btn-copy');
  btnClear = document.getElementById('btn-clear');
  errorMessage = document.getElementById('error-message');

  // 绑定事件
  bindEvents();
}

// 绑定事件
function bindEvents() {
  btnExecute.addEventListener('click', handleExecute);
  btnCopy.addEventListener('click', handleCopy);
  btnClear.addEventListener('click', handleClear);
  
  // 回车键执行
  inputText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleExecute();
    }
  });
}

// 获取当前操作模式
function getMode() {
  for (const radio of modeRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return 'encrypt';
}

// 获取当前算法
function getAlgorithm() {
  return algorithmSelect.value;
}

// 执行加密或解密
function handleExecute() {
  clearError();
  
  const mode = getMode();
  const algorithm = getAlgorithm();
  const key = keyInput.value.trim();
  const text = inputText.value.trim();

  // 验证输入
  if (!key) {
    showError('请输入密钥');
    return;
  }

  if (!text) {
    showError('请输入内容');
    return;
  }

  try {
    let result;
    
    if (algorithm === 'des-ecb') {
      result = mode === 'encrypt' ? desEcbEncrypt(text, key) : desEcbDecrypt(text, key);
    } else if (algorithm === 'des-cbc') {
      
      result = mode === 'encrypt' ? desCbcEncrypt(text, key) : desCbcDecrypt(text, key);
      console.log('des-cbc', text, key, result);
    }
    
    outputText.value = result;
  } catch (err) {
    showError('操作失败: ' + err.message);
  }
}

// ==================== DES-ECB 算法 ====================

/**
 * DES-ECB 加密
 * @param {string} text - 明文
 * @param {string} key - 密钥（8位，不足自动补全）
 * @returns {string} HEX大写密文
 */
function desEcbEncrypt(text, key) {
  // 确保密钥长度为8位
  const paddedKey = padKey(key);
  
  const keyBytes = CryptoJS.enc.Utf8.parse(paddedKey);
  const textBytes = CryptoJS.enc.Utf8.parse(text);
  
  // 使用 ECB 模式加密，PKCS7 填充
  const encrypted = CryptoJS.DES.encrypt(textBytes, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // 返回 HEX 大写字符串
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
}

/**
 * DES-ECB 解密
 * @param {string} hexStr - HEX密文
 * @param {string} key - 密钥（8位，不足自动补全）
 * @returns {string} 明文
 */
function desEcbDecrypt(hexStr, key) {
  // 确保密钥长度为8位
  const paddedKey = padKey(key);
  
  const keyBytes = CryptoJS.enc.Utf8.parse(paddedKey);
  const ciphertext = CryptoJS.enc.Hex.parse(hexStr);
  
  // 构建加密对象
  const encryptedObj = {
    ciphertext: ciphertext,
    key: keyBytes,
    iv: keyBytes // ECB 不需要 IV，但需要传入
  };
  
  // 使用 ECB 模式解密
  const decrypted = CryptoJS.DES.decrypt(encryptedObj, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// ==================== DES-CBC (MD5派生) 算法 ====================

/**
 * MD5 密钥派生
 * @param {string} password - 密码
 * @param {string} salt - 盐（十六进制字符串）
 * @param {number} iterations - 迭代次数
 * @returns {object} { key: 8字节密钥, iv: 8字节IV }
 */
function deriveKey(password, salt, iterations = 1000) {
  const passwordBytes = CryptoJS.enc.Utf8.parse(password);
  const saltBytes = CryptoJS.enc.Hex.parse(salt);
  
  // 初始: MD5(password + salt)
  const combined = CryptoJS.lib.WordArray.create(passwordBytes.words.concat(saltBytes.words));
  let hash = CryptoJS.MD5(combined);
  
  // 迭代计算
  for (let i = 1; i < iterations; i++) {
    hash = CryptoJS.MD5(hash);
  }
  
  // 前8字节作为密钥，后8字节作为IV
  // 使用 wordArraySlice 函数代替 slice 方法
  const key = wordArraySlice(hash, 0, 8);
  const iv = wordArraySlice(hash, 8, 16);
  
  return { key, iv };
}

/**
 * DES-CBC 加密（MD5密钥派生）
 * @param {string} plainText - 明文
 * @param {string} password - 密码
 * @returns {string} Base64密文
 */
function desCbcEncrypt(plainText, password) {
  // 生成随机盐（8字节）
  const salt = CryptoJS.lib.WordArray.random(8);
  const saltHex = salt.toString(CryptoJS.enc.Hex);
  
  // 派生密钥和IV
  const { key, iv } = deriveKey(password, saltHex);
  
  // 使用 CBC 模式加密
  const encrypted = CryptoJS.DES.encrypt(plainText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // 将盐和密文拼接后转为 Base64
  const ciphertext = encrypted.ciphertext;
  const result = CryptoJS.lib.WordArray.create(salt.words.concat(ciphertext.words));
  
  return result.toString(CryptoJS.enc.Base64);
}

/**
 * DES-CBC 解密（MD5密钥派生）
 * @param {string} base64Str - Base64密文
 * @param {string} password - 密码
 * @returns {string} 明文
 */
function desCbcDecrypt(base64Str, password) {
  // 解码 Base64
  const encryptedData = CryptoJS.enc.Base64.parse(base64Str);
  
  // 提取盐（前8字节）和密文（剩余部分）
  const salt = wordArraySlice(encryptedData, 0, 8);
  const ciphertext = wordArraySlice(encryptedData, 8);
  const saltHex = salt.toString(CryptoJS.enc.Hex);
  
  // 派生密钥和IV
  const { key, iv } = deriveKey(password, saltHex);
  
  // 构建加密对象
  const encryptedObj = {
    ciphertext: ciphertext,
    key: key,
    iv: iv
  };
  
  // 使用 CBC 模式解密
  const decrypted = CryptoJS.DES.decrypt(encryptedObj, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * WordArray 切片函数（CryptoJS WordArray 没有 slice 方法）
 * @param {CryptoJS.lib.WordArray} wordArray - 源 WordArray
 * @param {number} start - 起始字节位置
 * @param {number} [end] - 结束字节位置
 * @returns {CryptoJS.lib.WordArray} 切片后的 WordArray
 */
function wordArraySlice(wordArray, start, end) {
  const startWord = start >>> 2;
  const startBit = (start & 3) << 3;
  const endWord = end ? (end >>> 2) : wordArray.words.length;
  const endBit = end ? ((end & 3) << 3) : 32;
  
  const resultWords = [];
  
  for (let i = startWord; i < endWord; i++) {
    let word = wordArray.words[i] || 0;
    
    if (i === startWord && i === endWord - 1) {
      // 同一个 word 内的切片
      const maskStart = 0xFFFFFFFF << (32 - startBit);
      const maskEnd = 0xFFFFFFFF >>> endBit;
      word = (word & maskStart) >>> (32 - endBit);
    } else if (i === startWord) {
      // 起始 word
      word = word >>> (32 - startBit);
    } else if (i === endWord - 1) {
      // 结束 word
      const mask = 0xFFFFFFFF >>> endBit;
      word = word & mask;
    }
    
    resultWords.push(word);
  }
  
  const resultSigBytes = end ? (end - start) : ((wordArray.sigBytes || wordArray.words.length * 4) - start);
  
  return CryptoJS.lib.WordArray.create(resultWords, resultSigBytes);
}

// ==================== 辅助函数 ====================

/**
 * 补全密钥到8位
 * @param {string} key - 原始密钥
 * @returns {string} 补全后的密钥
 */
function padKey(key) {
  if (key.length >= 8) {
    return key.substring(0, 8);
  }
  // 使用空格补全
  return key.padEnd(8, ' ');
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

/**
 * 清除错误信息
 */
function clearError() {
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';
}

/**
 * 复制结果
 */
function handleCopy() {
  const text = outputText.value;
  if (!text) {
    showError('没有可复制的内容');
    return;
  }
  
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnCopy.textContent;
    btnCopy.textContent = '已复制';
    setTimeout(() => {
      btnCopy.textContent = originalText;
    }, 2000);
  }).catch(() => {
    showError('复制失败');
  });
}

/**
 * 清空所有内容
 */
function handleClear() {
  keyInput.value = '';
  inputText.value = '';
  outputText.value = '';
  clearError();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

// 单元测试导出模块
/* istanbul ignore next */
if (__JEST__ && typeof module !== 'undefined') {
  module.exports = {
    init,
    desEcbEncrypt,
    desEcbDecrypt,
    desCbcEncrypt,
    desCbcDecrypt,
    deriveKey,
    padKey
  };
}