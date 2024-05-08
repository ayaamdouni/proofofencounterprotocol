import React, {useState, useEffect} from 'react';
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
import '@walletconnect/react-native-compat';
import {
  WalletConnectModal,
  useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import {createWalletClient, custom} from 'viem';
import {mainnet, sepolia} from 'viem/chains';
import {createPublicClient, http} from 'viem';
import {NativeModules, NativeEventEmitter} from 'react-native';

const projectId = '91c6dd7306179066910230868eabcb55';

const providerMetadata = {
  name: 'YOUR_PROJECT_NAME',
  description: 'YOUR_PROJECT_DESCRIPTION',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};
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

const App = () => {
  const {open, isConnected, provider} = useWalletConnectModal();
  const [deviceA, setDeviceA] = useState('');
  const [deviceB, setDeviceB] = useState('');
  const [bTimestamp, setbTimestamp] = useState('');
  const [aTimestamp, setaTimestamp] = useState('');
  const [TEncounterID, setTEncounterID] = useState('0x50');
  const [FEncounterID, setFEncounterID] = useState('');
  const [argumentsTx, setArguments] = useState([]);
  const [connectedEndpoint, setConnectedEndpooit] = useState('');

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
      'https://sepolia.infura.io/v3/777255a92575483a9ec9116de0833863',
    ),
  });

  // useEffect(() => {
  const initEncounter = async (
    deviceAparams,
    aTimestampparams,
    TEncounterIDparams,
  ) => {
    console.log('executing init encounter: ', deviceAparams, aTimestampparams);
    try {
      // console.log('public client', publicClient);

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
        address: '0x23c9E51D1596b529Fb8f3196bb7d4656aCAD78e7',
        abi: ContractABI,
        functionName: 'initEncounter',
        args: ['0xBfA25A6ff03b2A0edD94028D03AcF4B3A1627e7f', '0x50', '3024'],
        account: '0xBfA25A6ff03b2A0edD94028D03AcF4B3A1627e7f',
      });
      console.log('hash of Tx: ', hash);
    } catch (err) {
      console.log('erreur while executing the transaction', err);
    }
  };
  const unwatch = publicClient.watchEvent({
    address: '0x23c9E51D1596b529Fb8f3196bb7d4656aCAD78e7',
    onLogs: logs => {
      console.log('Event emited from init Encounter Tx', logs[0].data);
      NearbyConnectionModule.getConnectedEndpoint(endpointId => {
        setConnectedEndpooit(endpointId);
        NearbyConnectionModule.sendData(
          2,
          endpointId,
          '0x6070c640119b7b53f67E211bD44688a11B5A7409' +
            ' ' +
            TEncounterID +
            ' ' +
            logs[0].data,
        );
        console.log('EncounterIndex sent');
      });
    },
  });
  const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
  let InitEventListener = eventEmitter.addListener(
    'initEncounterEvent',
    event => {
      //Started Discovering
      console.log('testing Tx');
      console.log('event to init Encounter emitted:', event.MessageReceived); //property
      setArguments(event.newMessageReceived.split(' '));
      console.log(argumentsTx);
      setDeviceA(argumentsTx[0]);
      setaTimestamp(argumentsTx[1]);
      console.log('testing Tx:', deviceA, aTimestamp);
      initEncounter(deviceA, aTimestamp, '0x56');
      console.log('after Tx');

      // NearbyConnectionModule.getReceivedMessage(message => {
      //   console.log('message:', message);
      //   const args = message.split(' ');
      //   setDeviceA(args[0]);
      //   setaTimestamp(args[1]);
      //   console.log(deviceA);
      //   console.log('testing Tx');
      // });
      // initEncounter(deviceA, aTimestamp, TEncounterID);
    },
  );
  let TEEventListener = eventEmitter.addListener(
    'retrieveTEncounterEvent',
    event => {
      console.log('retrieve TEncounter Event', event.MessageReceived);
      retrieveTEncounterIDFunction(encounterIndex, deviceA, bTimestamp,);
    },
  );
  let FEEventListener = eventEmitter.addListener(
    'retrieveFEncounterEvent',
    event => {
      console.log('retrieve FEncounter Event', event.MessageReceived);
    },
  );
  // Removes the listener once unmounted
  // return () => {
  //   eventListener.remove();
  // };
  // },[]);

  const {NearbyConnectionModule} = NativeModules;
  const startDiscovering = () => {
    NearbyConnectionModule.startDiscovering(
      '0xbfa25a6ff03b2a0edd94028d03acf4b3a1627e7f',
      '1500',
    );
  };
  const startAdvertising = () => {
    NearbyConnectionModule.startAdvertising();
  };
  const stopDiscovering = () => {
    NearbyConnectionModule.stopDiscovering();
  };
  const stopAdvertising = () => {
    NearbyConnectionModule.stopAdvertising();
  };
  const sendData = data => {
    NearbyConnectionModule.sendData(connectedEndpoint, data);
  };
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
    setTEncounterID(data);
  };
  const onPress = () => {
    if (isConnected) {
      provider.disconnect();
    } else {
      open();
    }
  };

  return (
    <>
      <Button
        title={isConnected ? 'Disconnect' : 'Connect'}
        onPress={onPress}
      />
      <Button title="start discovering" onPress={startDiscovering} />
      <Button title="stop discovering" onPress={stopDiscovering} />
      <Button title="start advertising" onPress={startAdvertising} />
      <Button title="stop advertising" onPress={stopAdvertising} />
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
      {/* <Button title="init Encounter" onPress={initEncounter} /> */}
    </>
  );
};
export default App;
