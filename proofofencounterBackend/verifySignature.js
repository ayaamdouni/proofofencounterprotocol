const crypto = require('crypto');
const fs = require("fs");

const publicKeyB = fs.readFileSync("Keys/publicB.pem", { encoding: "utf-8" });
const publicKeyA = fs.readFileSync("Keys/publicA.pem", { encoding: "utf-8" });
function verifySignature(message, signature, publicKey1) {
    console.log('verifing signature called');
    let publicKey;
    if(publicKey1 == 'publickeyA') {
        publicKey = publicKeyA;
    } else if (publicKey1 == 'publickeyB') {
        publicKey = publicKeyB;
    }
    console.log('verifing signature');
    
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(message);
    const result = verify.verify(publicKey, signature, 'hex')
    console.log('the result of verifing signature', result);
    return result;
}

module.exports = verifySignature;