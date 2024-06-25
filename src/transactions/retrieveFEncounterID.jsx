import {ContractABI} from '../Contract/contractABI';
import {mainnet, sepolia, fantomTestnet} from 'viem/chains';
import {createPublicClient, custom} from 'viem';
export const retrieveFEncounterIDFunction = async (
  encounterIndexparams,
  deviceBparams,
  aTimestampparams,
  provider,
) => {
  try {
    const publicClient = createPublicClient({
      chain: fantomTestnet,
      transport: custom(provider),
      // transport: http(
      //   'https://sepolia.infura.io/v3/777255a92575483a9ec9116de0833863',
      // ),
    });
    console.log(
      'retrieving FEncounterID params:',
      encounterIndexparams,
      ' ',
      deviceBparams,
      ' ',
      aTimestampparams,
    );
    const data = await publicClient
      .readContract({
        address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
        abi: ContractABI,
        functionName: 'retrieveFEncounterID',
        args: [encounterIndexparams, deviceBparams, aTimestampparams],
      })
      .catch(err => console.log('erreur', err));
    console.log('result of retrieve FEncounterID', data);
    return data;
  } catch (error) {
    console.error('error in retrieving FEncounterID', error);
    throw error;
  }
};
