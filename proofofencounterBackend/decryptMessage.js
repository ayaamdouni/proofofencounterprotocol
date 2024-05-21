const crypto = require('crypto');
const fs = require("fs");

const privateKeyA = fs.readFileSync("Keys/privateA.pem", { encoding: "utf-8" });
const privateKeyB = fs.readFileSync("Keys/privateB.pem", { encoding: "utf-8" });

function decryptMessage(encryptedMessage, privateKey1) {
    console.log('decrypting data called');
    let privateKey;
    if(privateKey1 == 'privateKeyA') {
        privateKey = privateKeyA;
    } else if (privateKey1 == 'privateKeyB') {
        privateKey = privateKeyB;
    }
    try {
        const messageBuffer = Buffer.from(encryptedMessage, 'base64');
        const decryptedMessage = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
              },
            messageBuffer
        );
        return decryptedMessage.toString();
    } catch (error) {
        console.error('Error during decryption:', error);
        throw error;
    }
}

module.exports = decryptMessage;

// const crypto = require('crypto');
// const fs = require("fs");
// const initVector = fs.readFileSync("initVectorAES.pem");
// function decryptWithAES(encryptedMessage, AESkey) {
//     const decipher = crypto.createDecipheriv('aes-256-cbc', AESkey, initVector);
//     let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
//     decrypted += decipher.final('utf-8');
//     return decrypted;
// }
// function decryptMessage(encryptedMessage, encryptedKey) {
//     try {
//         console.log('encrypted: ', encryptedMessage, encryptedKey);
//         const keyBuffer = Buffer.from(encryptedKey, 'base64');
//         const privateKey = fs.readFileSync("privateA.pem", { encoding: "utf-8" });

//         const decryptedKey = crypto.privateDecrypt(
//             {
//                 key: privateKey,
//                 padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//                 oaepHash: 'sha256',
//             },
//             keyBuffer
//         );
//         console.log(decryptedKey.toString('utf-8'));
//         const decryptedData = decryptWithAES(encryptedMessage, decryptedKey);
//         return decryptedData;
//     } catch (error) {
//         console.error('Error during decryption:', error);
//         throw error;
//     }
// }
// module.exports = decryptMessage;