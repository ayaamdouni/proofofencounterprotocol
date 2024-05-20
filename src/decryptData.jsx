import axios from 'axios';
export const decryptData = async (encryptedMessage, privateKey) => {
  try {
    console.log('encrypted Data in decrypt fn: ', encryptedMessage);
    const response = await axios.post('http://192.168.181.116:3000/decrypt', {
      encryptedMessage: encryptedMessage.toString(),
      privateKey: privateKey,
    });
    const decrypted = response.data.dataDecrypted;
    console.log('decrypted Data in decrypt fn: ', response.data.dataDecrypted);
    return response.data.dataDecrypted;
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw error;
  }
};
