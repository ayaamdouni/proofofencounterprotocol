const crypto = require('crypto');
const fs = require("fs");

const privateKeyB = fs.readFileSync("Keys/privateB.pem", { encoding: "utf-8" });
console.log(privateKeyB);