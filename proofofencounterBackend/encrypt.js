const crypto = require('crypto');
const fs = require("fs");
const publicKeyA = fs.readFileSync("publicA.pem", { encoding: 'utf-8' });

function encrypt (didB, TencounterID, incrementalIndexB, publicKey1) {
    console.log('encrypting data called');
    const buffer = Buffer.from(didB + ':' + TencounterID + ':' + incrementalIndexB);
    const publicKey = publicKeyA;

    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        buffer
    );

    return encryptedData.toString('base64');
};

module.exports = encrypt;






// const crypto = require('crypto');
// const fs = require("fs");

// const aesKey = fs.readFileSync("keyAES.pem");
// const initVector = fs.readFileSync("initVectorAES.pem");

// function generateAESKey() {
//     return crypto.randomBytes(32); 
// }

// // Function to encrypt data with AES
// function encryptWithAES(data) {
//     const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, initVector);
//     let encrypted = cipher.update(data, 'utf8', 'base64');
//     encrypted += cipher.final('base64');
//     return encrypted;
// }

// // Function to encrypt AES key with RSA
// function encryptAESKeyWithRSA(encryptedData, publicKey) {
//     return crypto.publicEncrypt(
//         {
//             key: publicKey,
//             padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//             oaepHash: 'sha256',
//         },
//         encryptedData
//     ).toString('base64');
// }

// function encryptData(didB, TencounterID, incrementalIndexB, publicKey1) {
//     try {
//         const publicKey = fs.readFileSync("publicA.pem", { encoding: 'utf-8' });

//         const message = `${didB}:${TencounterID}:${incrementalIndexB}`;

//         // Encrypt the message with AES
//         const encryptedData = encryptWithAES(message, aesKey, initVector);

//         // Encrypt the AES key with RSA
//         const encryptedAESKey = encryptAESKeyWithRSA(aesKey, publicKey);

//         console.log('Encrypted Data:', encryptedData);
//         console.log('Encrypted AES Key:', encryptedAESKey);
//         console.log('Initialization Vector:', initVector.toString('base64'));

//         return {
//             encryptedData,
//             encryptedAESKey,
//             initVector: initVector.toString('base64')
//         };
//     } catch (error) {
//         console.error('Error during encryption:', error);
//         throw error;
//     }
// }


