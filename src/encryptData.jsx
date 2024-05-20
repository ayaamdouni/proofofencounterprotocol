import axios from 'axios';
import {SERVERURL} from '@env';
export const encryptData = async (
  didB,
  TencounterID,
  incrementalIndexB,
  publicKey,
) => {
  try {
    const response = await axios.post(`http://192.168.181.116:3000/encrypt`, {
      didB: didB,
      TencounterID: TencounterID,
      incrementalIndexB: incrementalIndexB,
      publicKey: publicKey,
    });
    const encrypted = response.data.encryptedData;
    console.log('encrypted Data received: ', encrypted);
    return encrypted;
  } catch (error) {
    console.error('Error in encrypting data:', error);
    throw error;
  }
};
