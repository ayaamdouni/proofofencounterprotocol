import {ContractABI} from '../Contract/contractABI';
import {privateKeyToAccount} from 'viem/accounts';
import {createWalletClient, custom, createPublicClient} from 'viem';
import {fantomTestnet, sepolia} from 'viem/chains';
import {encodeFunctionData} from 'viem';
import {parseGwei} from 'viem';
import Web3 from 'web3';
export const testPrivate = async provider => {
  const account = privateKeyToAccount(
    // '0x54b35ccf00e053a2ba119722e3e8d7c75198cf37d905929a044fde88e5276367',
    '0x02f9bbbbd406558a9fa10d1ce7de14d663d29aa62981e3bd2a3fc2277d3e9a8a',
  );
  const walletClient = createWalletClient({
    account,
    chain: fantomTestnet,
    transport: custom(provider),
  });
  const publicClient = createPublicClient({
    chain: fantomTestnet,
    transport: custom(provider),
  });
  try {
    const hash = await walletClient.writeContract({
      address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
      abi: ContractABI,
      functionName: 'initEncounter',
      args: ['0xBfA25A6ff03b2A0edD94028D03AcF4B3A1627e7f', '0x2356', '12378'],
      account: account,
    });
    console.log('the hash is:', hash);
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });
    console.log('The transaction is mined with success: ', transaction);
  } catch (error) {
    console.log('error in sending the TX:', error.message);
  }
};
