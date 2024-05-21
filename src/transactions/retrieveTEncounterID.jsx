import {ContractABI} from '../Contract/contractABI';
import {mainnet, sepolia} from 'viem/chains';
import {createPublicClient, custom} from 'viem';


export const retrieveTEncounterIDFunction = async (
  encounterIndexparams,
  deviceAparams,
  bTimestampparams,
  provider,
) => {
  try {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: custom(provider),
      // transport: http(
      //   'https://sepolia.infura.io/v3/777255a92575483a9ec9116de0833863',
      // ),
    });
    console.log(
      'retrieving TEncounterID params:',
      encounterIndexparams,
      ' ',
      deviceAparams,
      ' ',
      bTimestampparams,
    );
    const data = await publicClient
      .readContract({
        address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
        abi: ContractABI,
        functionName: 'retrieveTEncounterID',
        args: [
          encounterIndexparams,
          deviceAparams,
          bTimestampparams, //'14', '0xBfA25A6ff03b2A0edD94028D03AcF4B3A1627e7f', '3030'
        ],
      })
      .catch(err => console.log('erreur', err));
    console.log('result of retrieve TEncounterID', data);
    return data;
  } catch (error) {
    console.error('error in retrieving TEncounterID', error);
    throw error;
  }

};
