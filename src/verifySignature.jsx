import axios from 'axios';
export const signMessage = async (message, signature, publicKey) => {
  try {
    const response = await axios.post('http://192.168.0.246:3000/verifySign', {
      message: message,
      signature: signature,
      publicKey: publicKey
    });
    const verifSignature = response.data.verifingResult;
    return verifSignature;
  } catch (error) {
    console.error('Error in verifing the signature:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};
