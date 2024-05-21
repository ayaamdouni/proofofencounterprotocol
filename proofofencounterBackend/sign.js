const crypto = require('crypto');
const fs = require("fs");
const privateKeyA = fs.readFileSync("Keys/privateA.pem", { encoding: "utf-8" });
const privateKeyB = fs.readFileSync("Keys/privateB.pem", { encoding: "utf-8" });

function signMessage(message, privateKey1) {
    console.log('siging message called');
    let privateKey;
    if(privateKey1 == 'privateKeyA') {
        privateKey = privateKeyA;
    } else if (privateKey1 == 'privateKeyB') {
        privateKey = privateKeyB;
    }
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(message);
    signature = sign.sign(privateKey, 'hex');
    console.log("signed message:", signature);
    return signature;
}

module.exports = signMessage; 