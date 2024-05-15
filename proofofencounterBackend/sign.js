const crypto = require('crypto');
const fs = require("fs");

function signMessage(message, privateKey1) {
    const privateKey = fs.readFileSync("privateB.pem", { encoding: "utf-8" });
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(message);
    signature = sign.sign(privateKey, 'hex');
    console.log(signature);
    return signature;
}

// signMessage("hello this is a message to sign", "")
module.exports = signMessage; 