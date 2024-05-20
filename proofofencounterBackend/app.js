const express = require('express');
const signMessage = require('./sign');
const encryptData = require('./encrypt');
const decryptData = require('./decryptMessage');
const verifySignature = require('./verifySignature');
const app = express();

app.use(express.json());

app.post('/sign', (req, res) => {
    const { message, privateKey } = req.body;
    const signature = signMessage(message, privateKey);
    res.json({signature});
});
app.post('/verifySign', (req, res) => {
    const { message, signature, publicKey } = req.body;
    const verifingResult = verifySignature(message, signature, publicKey);
    res.json({verifingResult});
});
app.post('/encrypt', (req, res) => {
    const {didB, TencounterID, incrementalIndexB, publicKey} = req.body;
    const encryptedData = encryptData(didB, TencounterID, incrementalIndexB, publicKey);
    res.json({encryptedData});
});
app.post('/decrypt', (req, res) => {
    const {encryptedMessage, privateKey} = req.body;
    const dataDecrypted = decryptData(encryptedMessage, privateKey);
    res.json({dataDecrypted});
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});