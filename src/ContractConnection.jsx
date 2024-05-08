/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import {mainnet, polygon, arbitrum, sepolia} from 'viem/chains';
import {createPublicClient, http} from 'viem';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(
    'https://sepolia.infura.io/v3/777255a92575483a9ec9116de0833863',
  ),
});

const ContractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Index',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'encounters',
    outputs: [
      {
        internalType: 'address',
        name: 'deviceA',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signedTEncounterID',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'bTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'deviceB',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signedFEncounterID',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'aTimestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'encounterIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'deviceB',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signedFEncounterID',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'aTimestamp',
        type: 'uint256',
      },
    ],
    name: 'finalizeEncounter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'deviceA',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'signedTEncounterID',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'bTimestamp',
        type: 'uint256',
      },
    ],
    name: 'initEncounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'encounterIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'deviceB',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'aTimestamp',
        type: 'uint256',
      },
    ],
    name: 'retrieveFEncounterID',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'encounterIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'deviceA',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'bTimestamp',
        type: 'uint256',
      },
    ],
    name: 'retrieveTEncounterID',
    outputs: [
      {
        internalType: 'bytes',
        name: 'Index',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const ContractConnect = () => {
  const retrieveTEncounterIDFunction = async (
    encounterIndex,
    deviceA,
    bTimestamp,
  ) => {
    console.log('start');
    const data = await publicClient
      .readContract({
        address: '0x23c9E51D1596b529Fb8f3196bb7d4656aCAD78e7',
        abi: ContractABI,
        functionName: 'retrieveTEncounterID',
        args: [encounterIndex, deviceA, bTimestamp],
      })
      .catch(err => console.log('erreur', err));

    console.log('result ', data);
  };
  const retrieveFEncounterIDFunction = async (
    encounterIndex,
    deviceB,
    aTimestamp,
  ) => {
    console.log('start');
    const data = await publicClient
      .readContract({
        address: '0x23c9E51D1596b529Fb8f3196bb7d4656aCAD78e7',
        abi: ContractABI,
        functionName: 'retrieveFEncounterID',
        args: [encounterIndex, deviceB, aTimestamp],
      })
      .catch(err => console.log('erreur', err));

    console.log('result ', data);
  };
  return (
    <Button
      title="retrieve TEncounter ID"
      onPress={() =>
        retrieveTEncounterIDFunction(
          '1',
          '0xbfa25a6ff03b2a0edd94028d03acf4b3a1627e7f',
          '2024',
        )
      }
    />
  );
};

export default ContractConnect;
