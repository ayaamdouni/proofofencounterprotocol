import axios from 'axios';
import {SERVERURL} from '@env';
export const encryptData = async (FencounterID, aTimestamp, publicKey) => {
  try {
    const response = await axios.post(`http://192.168.0.246:3000/encryptData`, {
      FencounterID: FencounterID,
      aTimestamp: aTimestamp,
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
