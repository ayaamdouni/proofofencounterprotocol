import {ContractABI} from './Contract/contractABI';
import {createWalletClient, custom} from 'viem';
import {mainnet, sepolia, fantomTestnet} from 'viem/chains';

export const finalizeEncounter = async (
  provider,
  address,
  encounterIndexparams,
  deviceBparams,
  signedFEncounterID,
  aTimestampparams,
) => {
  console.log(
    'executing finalize encounter: ',
    encounterIndexparams,
    deviceBparams,
    signedFEncounterID,
    aTimestampparams,
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

    // NearbyConnectionModule.sendData(
    //   '2',
    //   connectedEndpoint,
    //   FEncounterID + // '0x6070c640119b7b53f67E211bD44688a11B5A7409' +
    //     ' ' +
    //     aTimestamp +
    //     ' ' +
    //     +'3',
    // );
    // console.log('final message sent');
  } catch (err) {
    console.log('Error while executing the transaction', err);
  }
};
