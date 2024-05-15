import axios from 'axios';
export const signMessage = async (message, privateKey) => {
  try {
    const response = await axios.post('http://192.168.0.246:3000/sign', {
      message: message,
      privateKey: 'Device B private key',
    });
    const hexSignature = '0x' + response.data.signature;
    console.log('signed TEncounterID: ', hexSignature);
    return hexSignature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};
