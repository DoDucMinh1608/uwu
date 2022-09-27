var CryptoJS = require("crypto-js");

// Encrypt
const a = Math.random() + ''
var ciphertext = CryptoJS.AES.encrypt('asafdasfasf', Math.random() + '').toString();

console.log(ciphertext)
// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, Math.random() + '');
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'my message'