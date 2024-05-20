import {ContractABI} from './Contract/contractABI';
import {createWalletClient, custom} from 'viem';
import {mainnet, sepolia, fantomTestnet} from 'viem/chains';
import {NativeModules} from 'react-native';
import {encryptData} from './encryptData';
import {signMessage} from './signMessage';
const {NearbyConnectionModule} = NativeModules;
export const initEncounter = async (
  provider,
  address,
  deviceAparams,
  TEncounterIDparams,
  bTimestampparams,
  connectedEndpoint,
  localIncrementalIndexB,
) => {
  const signedTEncounterID = await signMessage(
    TEncounterIDparams.toString(),
    'privateKeyB',
  );
  console.log(
    'params of init Tx: ',
    deviceAparams,
    TEncounterIDparams,
    bTimestampparams,
  );
  try {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(provider),
    });
    const hash = await walletClient.writeContract({
      address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
      abi: ContractABI,
      functionName: 'initEncounter',
      args: [deviceAparams, signedTEncounterID, bTimestampparams],
      account: address,
    });
    console.log('hash of init Tx:', hash);
    console.log(
      'data to be encrypted after init',
      address,
      TEncounterIDparams,
      localIncrementalIndexB,
    );
    const messageToSend = await encryptData(
      address,
      TEncounterIDparams,
      localIncrementalIndexB,
      'publicKeyA',
    );
    NearbyConnectionModule.sendData(
      '2',
      connectedEndpoint,
      messageToSend + '2',
    );
    return hash;
  } catch (err) {
    console.log('Error while executing the init encounter transaction', err);
    throw err;
  }
};
