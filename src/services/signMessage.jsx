import axios from 'axios';
export const signMessage = async (message, privateKey) => {
  try {
    const response = await axios.post('http://192.168.0.246:3000/sign', {
      message: message,
      privateKey: privateKey,
    });
    const hexSignature = '0x' + response.data.signature;
    if (privateKey === 'privateKeyA') {
      console.log('signed FEncounterID: ', hexSignature);
    } else if (privateKey === 'privateKeyB') {
      console.log('signed TEncounterID: ', hexSignature);
    }
    return hexSignature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};
