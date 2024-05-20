const crypto = require('crypto');
const fs = require("fs");

const publicKeyB = fs.readFileSync("publicB.pem", { encoding: 'utf-8' });

function encryptData (FencounterID, aTimestamp, publicKey1) {
    console.log('encrypting data called');
    const buffer = Buffer.from(FencounterID + ':' + aTimestamp);
    const publicKey = publicKeyB;

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

module.exports = encryptData;
