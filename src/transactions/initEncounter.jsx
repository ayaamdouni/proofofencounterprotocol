import {ContractABI} from '../Contract/contractABI';
import {createWalletClient, custom, createPublicClient} from 'viem';
import {mainnet, sepolia, fantomTestnet} from 'viem/chains';
import {NativeModules} from 'react-native';
import {encrypt} from '../services/encrypt';
import {signMessage} from '../services/signMessage';
import {privateKeyToAccount} from 'viem/accounts';
const {NearbyConnectionModule} = NativeModules;
export const initEncounter = async (
  provider,
  address,
  deviceAparams,
  TEncounterIDparams,
  bTimestampparams,
  connectedEndpoint,
  localIncrementalIndexB,
  initStart,
) => {
  const signedTEncounterID = await signMessage(
    TEncounterIDparams.toString(),
    'privateKeyB',
  );
  const account = privateKeyToAccount(
    '0x02f9bbbbd406558a9fa10d1ce7de14d663d29aa62981e3bd2a3fc2277d3e9a8a',
  );
  const publicClient = createPublicClient({
    chain: fantomTestnet,
    transport: custom(provider),
  });
  // console.log('the account of this private key is:', account);
  console.log(
    'params of init Tx: ',
    deviceAparams,
    signedTEncounterID,
    bTimestampparams,
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
      functionName: 'initEncounter',
      args: [deviceAparams, signedTEncounterID, bTimestampparams],
      account: account,
    });
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });
    // console.log('The init Encounter TX is mined with success: ', transaction);
    // console.log('hash of init Tx:', hash);
    console.log(
      'data to be encrypted after init',
      address,
      TEncounterIDparams,
      localIncrementalIndexB,
    );
    const messageToSend = await encrypt(
      address,
      TEncounterIDparams,
      localIncrementalIndexB,
      bTimestampparams,
      'publicKeyA',
    );

    const initEnd = new Date();
    // console.log('the date of starting init Tx is:', initStart);
    // console.log('the date of ending init Tx is:', initEnd);
    console.log('the duration of init Tx part is', initEnd - initStart);
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
