const crypto = require('crypto');
const fs = require("fs");

const aesKey = fs.readFileSync("keyAES.pem");
const initVector = fs.readFileSync("initVectorAES.pem");

// Function to encrypt data with AES
function encryptWithAES(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, initVector);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decryptWithAES(encryptedMessage, AESkey) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', AESkey, initVector);
    let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}