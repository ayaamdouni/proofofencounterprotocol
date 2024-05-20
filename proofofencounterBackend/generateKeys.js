const crypto = require('crypto');
const fs = require("fs");


const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    },
});        

// *********************************************************************
//
// To export the public key and write it to file:

fs.writeFileSync("publicA.pem", publicKey, { encoding: "utf-8" });
  // *********************************************************************
  
  // *********************************************************************
  //
  // To export the private key and write it to file
  
 
fs.writeFileSync("privateA.pem", privateKey, {encoding: "utf-8",});
