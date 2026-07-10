const crypto = require("crypto");

// 默认密钥（与原始脚本保持一致）
const DEFAULT_PASSWORD = "aiot@tower";

/**
 * Jasypt PBEWithMD5AndDES key derivation
 */
function deriveKey(password, salt, iterations = 1000) {
  let data = Buffer.concat([Buffer.from(password, "utf8"), salt]);
  let hash = crypto.createHash("md5").update(data).digest();

  for (let i = 1; i < iterations; i++) {
    hash = crypto.createHash("md5").update(hash).digest();
  }

  return {
    key: hash.slice(0, 8), // DES key
    iv: hash.slice(8, 16)  // DES iv
  };
}

/**
 * 解密 ENC(...) 或原始 Base64 密文
 */
function decrypt(encValue, password) {
  let base64;
  if (encValue.startsWith("ENC(") && encValue.endsWith(")")) {
    base64 = encValue.slice(4, -1);
  } else {
    // 兼容没有 ENC() 包裹的纯 Base64 字符串
    base64 = encValue;
  }

  const encrypted = Buffer.from(base64, "base64");
  const salt = encrypted.slice(0, 8);
  const ciphertext = encrypted.slice(8);

  const { key, iv } = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv("des-cbc", key, iv);
  decipher.setAutoPadding(true);

  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}

/**
 * 加密明文，返回 ENC(...) 格式
 */
function encrypt(plainText, password) {
  const salt = crypto.randomBytes(8);
  const { key, iv } = deriveKey(password, salt);

  const cipher = crypto.createCipheriv("des-cbc", key, iv);
  cipher.setAutoPadding(true);

  let encrypted = cipher.update(plainText, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const result = Buffer.concat([salt, encrypted]).toString("base64");
  return `ENC(${result})`;
}

// ================== 命令行接口 ==================

function printUsage() {
  console.error(`
用法:
  node decrypt.js <密钥> <数据>
  node decrypt.js <数据>          (使用默认密钥 ${DEFAULT_PASSWORD})

说明:
  - 若数据以 "ENC(" 开头，则执行解密操作，输出明文
  - 否则执行加密操作，输出 ENC(...) 格式的密文
`);
}

function main() {
  const args = process.argv.slice(2);

  let password, data;

  if (args.length === 2) {
    password = args[0];
    data = args[1];
  } else if (args.length === 1) {
    password = DEFAULT_PASSWORD;
    data = args[0];
  } else {
    printUsage();
    process.exit(1);
  }

  try {
    const isEncrypted = data.startsWith("ENC(");
    if (isEncrypted) {
      const plain = decrypt(data, password);
      console.log(plain);
    } else {
      const encrypted = encrypt(data, password);
      console.log(encrypted);
    }
  } catch (err) {
    console.error("操作失败:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

// 导出函数以便其他模块使用（可选）
module.exports = { encrypt, decrypt, deriveKey };

/**

# 加密明文（使用默认密钥）
node decrypt.js "mypassword123"
# 输出: ENC(ogYbQTXMwNgph57NVYHaHQU7R32Rxyh9)

# 解密密文（使用默认密钥）
node decrypt.js "ENC(ogYbQTXMwNgph57NVYHaHQU7R32Rxyh9)"
# 输出: mypassword123

# 使用自定义密钥加密
node decrypt.js "mySecretKey" "hello world"
# 输出: ENC(7C4tQ5jK2n9p...)

# 使用自定义密钥解密
node decrypt.js "mySecretKey" "ENC(7C4tQ5jK2n9p...)"
# 输出: hello world

 */