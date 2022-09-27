const CryptoJS = require('./a')

var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
//U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=
console.log(encrypted)
var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
console.log(decrypted.toString(CryptoJS.enc.Utf8))
//4d657373616765