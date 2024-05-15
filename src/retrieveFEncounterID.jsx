import {ContractABI} from './Contract/contractABI';
import {mainnet, sepolia} from 'viem/chains';
import {createPublicClient, http} from 'viem';
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(
    'https://sepolia.infura.io/v3/777255a92575483a9ec9116de0833863',
  ),
});
export const retrieveFEncounterIDFunction = async (
  encounterIndexparams,
  deviceBparams,
  aTimestampparams,
) => {
  const data = await publicClient
    .readContract({
      address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
      abi: ContractABI,
      functionName: 'retrieveFEncounterID',
      args: [encounterIndexparams, deviceBparams, aTimestampparams],
    })
    .catch(err => console.log('erreur', err));

  console.log('result of retrieving FEncounterID: ', data);
};
