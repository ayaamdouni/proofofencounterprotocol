const crypto = require('crypto');
const fs = require("fs");

function decryptMessage(encryptedMessage) {
    try {
        console.log('encrypted: ', encryptedMessage);
        const messageBuffer = Buffer.from(encryptedMessage, 'base64');
        const privateKey = fs.readFileSync("privateA.pem", { encoding: "utf-8" });

        const decryptedMessage = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            messageBuffer
        );
        console.log(decryptedMessage.toString('utf-8'));
        return decryptedMessage.toString('utf-8');
    } catch (error) {
        console.error('Error during decryption:', error);
        throw error;
    }
}
module.exports = decryptMessage;