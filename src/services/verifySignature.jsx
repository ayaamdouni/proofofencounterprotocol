import axios from 'axios';
export const verifySign = async (message, signature, publicKey) => {
  try {
    const response = await axios.post(
      'http://192.168.0.246:3000/verifySign',
      {
        message: message,
        signature: signature,
        publicKey: publicKey,
      },
    );
    const verifSignature = response.data.verifingResult;
    if (publicKey === 'publickeyA') {
      console.log('result verify sign of FEncounter:', verifSignature);
    } else if (publicKey === 'publickeyB') {
      console.log('result verify sign of TEncounter:', verifSignature);
    }
    return verifSignature;
  } catch (error) {
    console.error('Error in verifing the signature:', error);
    throw error;
  }
};
