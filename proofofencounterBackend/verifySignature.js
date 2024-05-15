const crypto = require('crypto');
const fs = require("fs");

function verifySignature(message, signature, publicKey) {
    console.log('verifing signature');
    const publicKeyB = fs.readFileSync("publicB.pem", { encoding: "utf-8" });
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(message);
    console.log('result of verify sign: ', verify.verify(publicKeyB, signature, 'hex'));
    return verify.verify(publicKeyB, signature, 'hex');
}

module.exports = verifySignature;