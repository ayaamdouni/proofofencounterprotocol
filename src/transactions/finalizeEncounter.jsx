import {ContractABI} from '../Contract/contractABI';
import {createWalletClient, custom} from 'viem';
import {mainnet, sepolia, fantomTestnet} from 'viem/chains';
import {signMessage} from '../services/signMessage';
import {encryptData} from '../services/encryptData';
import {NativeModules} from 'react-native';
const {NearbyConnectionModule} = NativeModules;
export const finalizeEncounter = async (
  provider,
  address,
  encounterIndexparams,
  deviceBparams,
  FEncounterID,
  aTimestampparams,
  connectedEndpoint,
  localIncrementalIndexA,
) => {
  console.log(
    'Params of finalize encounter Tx: ',
    encounterIndexparams,
    deviceBparams,
    FEncounterID,
    aTimestampparams,
  );
  const signedFEncounterID = await signMessage(
    FEncounterID.toString(),
    'privateKeyA',
  );
  try {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(provider),
    });
    const hash = await walletClient.writeContract({
      address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
      abi: ContractABI,
      functionName: 'finalizeEncounter',
      args: [
        encounterIndexparams,
        deviceBparams, // '0x6070c640119b7b53f67E211bD44688a11B5A7409',
        signedFEncounterID,
        aTimestampparams,
      ],
      account: address, //'0x6070c640119b7b53f67E211bD44688a11B5A7409',
    });

    console.log('hash of finalize Tx:', hash);
    console.log(
      'data to be encrypted after finalize',
      FEncounterID,
      aTimestampparams,
    );
    const messageToSend = await encryptData(
      FEncounterID,
      aTimestampparams,
      'publicKeyB',
    );
    NearbyConnectionModule.sendData(
      '3',
      connectedEndpoint,
      messageToSend + '3',
    );
  } catch (err) {
    console.log('Error while executing the finalize transaction', err);
  }
};
