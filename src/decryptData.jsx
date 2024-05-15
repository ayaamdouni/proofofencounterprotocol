import axios from 'axios';
export const decryptData = async encryptedMessage => {
  try {
    const response = await axios.post('http://192.168.0.246:3000/decrypt', {
      encryptedMessage: encryptedMessage,
    });
    const decrypted = response.data.dataDecrypted;
    console.log('decrypted Data : ', response.data.dataDecrypted);
    return response.data.dataDecrypted;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};
