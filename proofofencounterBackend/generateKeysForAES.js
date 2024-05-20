const crypto = require('crypto');
const fs = require("fs");

const aesKey = crypto.randomBytes(32);
const initVector = crypto.randomBytes(16);

fs.writeFileSync("keyAES.pem", aesKey);
fs.writeFileSync("initVectorAES.pem", initVector);
