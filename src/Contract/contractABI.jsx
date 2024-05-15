export const ContractABI = [
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
