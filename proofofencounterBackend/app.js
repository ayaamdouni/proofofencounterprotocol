const express = require('express');
const signMessage = require('./sign');
const encryptData = require('./encrypt');
const decryptData = require('./decryptMessage');
const app = express();

app.use(express.json());

app.post('/sign', (req, res) => {
    const { message, privateKey } = req.body;
    const signature = signMessage(message, privateKey);
    res.json({signature});
});
app.post('/verifySign', (req, res) => {
    const { message, signature, publicKey } = req.body;
    const verifySignature = signMessage(message, signature, publicKey);
    res.json({verifySignature});
});
app.post('/encrypt', (req, res) => {
    const {didB, TencounterID, incrementalIndexB, publicKey} = req.body;
    const dataEncrypted = encryptData(didB, TencounterID, incrementalIndexB, publicKey);
    res.json({dataEncrypted});
})
app.post('/decrypt', (req, res) => {
    const {encryptedMessage} = req.body;
    const dataDecrypted = decryptData(encryptedMessage);
    res.json({dataDecrypted});
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});