import {ContractABI} from './Contract/contractABI';
import {createWalletClient, custom} from 'viem';
import {mainnet, sepolia, fantomTestnet} from 'viem/chains';
import {NativeModules} from 'react-native';
const {NearbyConnectionModule} = NativeModules;
export const initEncounter = async (
  provider,
  address,
  deviceAparams,
  TEncounterIDparams,
  bTimestampparams,
  connectedEndpoint,
) => {
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
    // const {reuslt} = await publicClient.simulateContract({
    //   address: '0x23c9E51D1596b529Fb8f3196bb7d4656aCAD78e7',
    //   abi: ContractABI,
    //   functionName: 'initEncounter',
    //   args: ['0xBfA25A6ff03b2A0edD94028D03AcF4B3A1627e7f', '0x50', '3024'],
    //   account: '0xBfA25A6ff03b2A0edD94028D03AcF4B3A1627e7f',
    // });
    // console.log('result', reuslt);
    const hash = await walletClient.writeContract({
      address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
      abi: ContractABI,
      functionName: 'initEncounter',
      args: [deviceAparams, TEncounterIDparams, bTimestampparams],
      account: address,
    });
    console.log('hash of Tx:', hash);
    NearbyConnectionModule.sendData(
      '2',
      connectedEndpoint,
      'hello this is a message after initing the transaction',
    );
    return hash;
  } catch (err) {
    console.log('Error while executing the transaction', err);
    throw err;
  }
};
