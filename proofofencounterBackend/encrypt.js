const crypto = require('crypto');
const fs = require("fs");
function encryptData(didB, TencounterID, incrementalIndexB, publicKey1) {
    try {
        const buffer = Buffer.from(didB + ':' + TencounterID + ':' + incrementalIndexB);
        const publicKey = fs.readFileSync("publicA.pem", { encoding: "utf-8" });
        const encryptedData = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            buffer
        );
        console.log('encrypted data', encryptedData.toString('base64'));
        return encryptedData.toString('base64');
    } catch (error) {
        console.error('Error during encryption:', error);
        throw error;
    }

};
module.exports = encryptData;