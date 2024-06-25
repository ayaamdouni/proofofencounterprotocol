import {ContractABI} from '../Contract/contractABI';
import {createWalletClient, custom, createPublicClient} from 'viem';
import {mainnet, sepolia, fantomTestnet} from 'viem/chains';
import {signMessage} from '../services/signMessage';
import {encryptData} from '../services/encryptData';
import {NativeModules} from 'react-native';
import {privateKeyToAccount} from 'viem/accounts';
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
  proofStart,
) => {
  const signedFEncounterID = await signMessage(
    FEncounterID.toString(),
    'privateKeyA',
  );
  const publicClient = createPublicClient({
    chain: fantomTestnet,
    transport: custom(provider),
  });
  const account = privateKeyToAccount(
    '0x54b35ccf00e053a2ba119722e3e8d7c75198cf37d905929a044fde88e5276367',
    // '0x02f9bbbbd406558a9fa10d1ce7de14d663d29aa62981e3bd2a3fc2277d3e9a8a',
  );
  console.log(
    'Params of finalize encounter Tx: ',
    encounterIndexparams,
    deviceBparams,
    signedFEncounterID,
    aTimestampparams,
  );
  try {
    const walletClient = createWalletClient({
      account,
      chain: fantomTestnet,
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
      account: account, //'0x6070c640119b7b53f67E211bD44688a11B5A7409',
    });

    // console.log('hash of finalize Tx:', hash);
    console.log(
      'data to be encrypted after finalize Tx',
      FEncounterID,
      aTimestampparams,
    );
    const messageToSend = await encryptData(
      FEncounterID,
      aTimestampparams,
      'publicKeyB',
    );
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });
    // console.log(
    //   'The finalize encounter TX is mined with success: ',
    //   transaction,
    // );
    const proofEnd = new Date();
    // console.log('the date of starting proof part is:', proofStart);
    // console.log('the date of ending proof part is:', proofEnd);
    console.log('the duration of proof part is:', proofEnd - proofStart);
    NearbyConnectionModule.sendData(
      '3',
      connectedEndpoint,
      messageToSend + '3',
    );
  } catch (err) {
    console.log('Error while executing the finalize transaction', err);
  }
};
