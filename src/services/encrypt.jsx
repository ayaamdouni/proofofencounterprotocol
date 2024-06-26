import axios from 'axios';
import {SERVERURL} from '@env';
export const encrypt = async (
  didB,
  TencounterID,
  incrementalIndexB,
  bTimestamp,
  publicKey,
) => {
  try {
    const response = await axios.post(`http://192.168.0.246:3000/encrypt`, {
      didB: didB,
      TencounterID: TencounterID,
      incrementalIndexB: incrementalIndexB,
      bTimestamp: bTimestamp,
      publicKey: publicKey,
    });
    const encrypted = response.data.encryptedData;
    console.log('Data encrypted received: ', encrypted);
    return encrypted;
  } catch (error) {
    console.error('Error in encrypting data:', error);
    throw error;
  }
};
