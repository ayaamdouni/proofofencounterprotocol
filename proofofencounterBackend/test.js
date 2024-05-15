const crypto = require('crypto');
const fs = require("fs");

function verifySignature(message, signature, publicKey) {
    const publicKeyB = fs.readFileSync("publicB.pem", { encoding: "utf-8" });
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(message);
    console.log('result of verify sign: ', verify.verify(publicKeyB, signature, 'hex'));
    return verify.verify(publicKeyB, signature, 'hex');
}
verifySignature("hello this is a message to sign", "296c17a698d17eeac6f221a82d8f95f143fd7a0c14f0272fde1852b837112a141bc20968f8ad27ac57f2e8412ca9177170c3044bacc34d4cb4fdc6e6f40d7336b8ab01928944e415b007be30b81fa9d2e3f8333c8e72f5cffaa68937a0755e7865118f105ea709e70c410788f103adb6d3fe95f026c8af61cf64d51a779c069d0f8bb97c895bfd43d9dd5f12be97b8f996e8fb23154d9fac46f051ff7185cff9666b3fbd2fdcb1eaa71316705006156ae26921e2d72c1810afc8760348b2423cd1b845cb8ac6602aefc0065488a5a6ae9fa62a9d174a3d74911e3324ab12b6368fc08da7452bcbee012d5bc5f145370dc3204c255734c440da334e2e59113712", "");