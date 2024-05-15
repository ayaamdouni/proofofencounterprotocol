import axios from 'axios';
export const encryptData = async (
  didB,
  TencounterID,
  incrementalIndexB,
  publicKey,
) => {
  try {
    const response = await axios.post('http://192.168.0.246:3000/encrypt', {
      didB: didB,
      TencounterID: TencounterID,
      incrementalIndexB: incrementalIndexB,
      publicKey: 'publicKey',
    });
    const encrypted = response.data.dataEncrypted;
    console.log('encrypted Data received: ', encrypted);
    return encrypted;
  } catch (error) {
    console.error('Error in encrypting data:', error);
    throw error;
  }
};
