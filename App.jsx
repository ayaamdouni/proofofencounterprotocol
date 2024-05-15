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
import {mainnet, sepolia, fantomTestnet} from 'viem/chains';
import {createPublicClient, hashDomain, http} from 'viem';
import {NativeModules, NativeEventEmitter} from 'react-native';
import {PROJECTID} from '@env';
import {initEncounter} from './src/initEncounter';
import {ContractABI} from './src/Contract/contractABI';
import {finalizeEncounter} from './src/finalizeEncounter';
import {retrieveTEncounterIDFunction} from './src/retrieveTEncounterID';
import {retrieveFEncounterIDFunction} from './src/retrieveFEncounterID';
import {signMessage} from './src/signMessage';
import {encryptData} from './src/encryptData';
import {decryptData} from './src/decryptData';
const projectId = PROJECTID;
const {NearbyConnectionModule} = NativeModules;
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

const App = () => {
  const {open, isConnected, provider, address} = useWalletConnectModal();
  const [deviceA, setDeviceA] = useState('');
  const [deviceB, setDeviceB] = useState('');
  const [localIncrementalIndexA, setLocalIncrementalIndexA] = useState(4);
  const [localIncrementalIndexB, setLocalIncrementalIndexB] = useState(5);
  const [bTimestamp, setbTimestamp] = useState('2000');
  const [aTimestamp, setaTimestamp] = useState('5000');
  const [TEncounterID, setTEncounterID] = useState('');
  const [FEncounterID, setFEncounterID] = useState('0x90');
  const [encounterIndex, setEncounterIndex] = useState('');
  const [connectedEndpoint, setConnectedEndpooit] = useState('');
  const [isDiscoverer, setisDiscoverer] = useState(false);
  const [isAdvertiser, setisAdvertiser] = useState(false);
  const [hashInit, setHashInit] = useState('');
  const [dataEncrypted, setEncryptedData] = useState('');
  const [dataDecrypted, setDataDecrypted] = useState('');
  const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
      'https://sepolia.infura.io/v3/777255a92575483a9ec9116de0833863',
    ),
  });
  const unwatch = publicClient.watchEvent({
    address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
    onLogs: logs => {
      setEncounterIndex(parseInt(logs[0].data, 16));
    },
  });

  let connectedToEndpointA = eventEmitter.addListener(
    'connectedToEndpointA',
    event => {
      console.log('Connected To an endpoint successfully: ', event);
      setConnectedEndpooit(event.endpointId);
    },
  );

  let connectedToEndpointB = eventEmitter.addListener(
    'connectedToEndpointB',
    event => {
      console.log('Connected To an endpoint successfully: ', event);
      setConnectedEndpooit(event.endpointId);
    },
  );
  useEffect(() => {
    if (deviceA && isDiscoverer) {
      console.log('device A:', deviceA);
      NearbyConnectionModule.startDiscovering(
        deviceA,
        aTimestamp,
        localIncrementalIndexA,
      );
    }
  }, [deviceA, localIncrementalIndexA]);
  useEffect(() => {
    if (deviceA && isAdvertiser && TEncounterID && bTimestamp) {
      console.log(
        'you can init encounter Tx:',
        deviceA,
        TEncounterID,
        bTimestamp,
      );
      const hash = initEncounter(
        provider,
        address,
        deviceA,
        TEncounterID,
        bTimestamp,
        connectedEndpoint,
      );
      // console.log('this is after init Encounter Tx', hash);
    }
  }, [TEncounterID, address, bTimestamp, deviceA]);
  useEffect(() => {
    let EventListener = eventEmitter.addListener(
      'MessageReceivedEvent',
      event => {
        console.log('New Message Received:', event.MessageReceived);
        switch (
          event.MessageReceived.charAt(event.MessageReceived.length - 1)
        ) {
          case '1':
            console.log('initing encounter Tx');
            setDeviceA(event.MessageReceived.split(' ')[0]);
            generateTEncounterID(
              localIncrementalIndexA,
              localIncrementalIndexB,
            );
            break;
          case '2':
            console.log('retrieve TEncounter');
            break;
          default:
            console.log('do nothing', event.MessageReceived[0]);
        }
      },
    );
  });

  // useEffect(() => {
  //   if (isAdvertiser) {
  //     let InitEventListener = eventEmitter.addListener(
  //       'initEncounterEvent',
  //       event => {
  //         console.log(
  //           'event to init Encounter emitted:',
  //           event.MessageReceived,
  //         );
  //         console.log('arguments table: ', event.MessageReceived.split(' '));
  //         setDeviceA(event.MessageReceived.split(' ')[0]);
  //         setTEncounterID(
  //           generateTEncounterID(
  //             localIncrementalIndexA,
  //             localIncrementalIndexB,
  //           ),
  //         );
  //       },
  //     );
  //   }
  // });
  const generateTEncounterID = async (indexA, indexB) => {
    // eslint-disable-next-line no-bitwise
    try {
      const TEncounter = indexA ^ indexB;
      const signedTEncounterID = await signMessage(
        TEncounter.toString(),
        'private Key B',
      );
      setTEncounterID(signedTEncounterID);
      return signedTEncounterID;
    } catch (error) {
      console.log('error in generating TEncounterID', error);
      throw error;
    }
  };

  // useEffect(() => {
  //   if (deviceA && isAdvertiser && TEncounterID) {
  //     console.log('initing encounter Tx', deviceA, TEncounterID, bTimestamp);
  //     // initEncounter(provider, address, deviceA, TEncounterID, bTimestamp);
  //   }
  // }, [deviceA, isAdvertiser, TEncounterID]);

  // useEffect(() => {
  //   if (isAdvertiser) {
  //     console.log(
  //       'encounterIndex emited from smart contract to deviceB: ',
  //       encounterIndex,
  //     );
  //     // NearbyConnectionModule.sendData(
  //     //   '2',
  //     //   connectedEndpoint,
  //     //   deviceB + ' ' + TEncounterID + ' ' + bTimestamp + ' ' + '2',
  //     // );
  //   }
  // }, [encounterIndex]);
  // useEffect(() => {
  //   if (isDiscoverer) {
  //     console.log(
  //       'encounterIndex emited from smart contract to deviceA: ',
  //       encounterIndex,
  //       deviceA,
  //     );
  //     let TEEventListener = eventEmitter.addListener(
  //       'retrieveTEncounterEvent',
  //       event => {
  //         console.log('retrieve TEncounter Event', event.MessageReceived);
  //         setDeviceB(event.MessageReceived.split(' ')[0]);
  //         setbTimestamp(event.MessageReceived.split(' ')[2]);
  //       },
  //     );
  //   }
  // }, [encounterIndex, deviceA]);
  // useEffect(() => {
  //   if (isDiscoverer) {
  //     retrieveTEncounterIDFunction(encounterIndex, deviceA, bTimestamp);
  //   }
  // }, [encounterIndex, deviceB, bTimestamp]);

  // let FEEventListener = eventEmitter.addListener(
  //   'retrieveFEncounterEvent',
  //   event => {
  //     console.log('retrieve FEncounter Event:', event.MessageReceived);
  //     retrieveFEncounterIDFunction(encounterIndex, address, aTimestamp);
  //   },
  // );
  // Removes the listener once unmounted
  // return () => {
  //   eventListener.remove();
  // };
  // },[]);

  const startDiscovering = () => {
    setDeviceA(address);
    setisDiscoverer(true);
    setLocalIncrementalIndexA(5);
    // NearbyConnectionModule.startAdvertising();
  };
  const startAdvertising = () => {
    setDeviceB(address);
    setisAdvertiser(true);
    setLocalIncrementalIndexB(4);
    NearbyConnectionModule.startAdvertising();
  };
  const stopDiscovering = () => {
    setisDiscoverer(false);
    setDeviceA('');
    setDeviceB('');
    NearbyConnectionModule.stopDiscovering();
  };
  const stopAdvertising = () => {
    setisAdvertiser(false);
    setDeviceA('');
    setDeviceB('');
    NearbyConnectionModule.stopAdvertising();
  };
  const sendData = data => {
    NearbyConnectionModule.sendData(connectedEndpoint, data);
  };
  const onPress = () => {
    if (isConnected) {
      provider.disconnect();
    } else {
      open();
    }
  };
  const encryptDataFn = async () => {
    const returnedData = await encryptData(
      'hello this is the address',
      '123456',
      '5',
      'publicKey',
    );
    setEncryptedData(returnedData);
  };
  const decryptDataFn = async () => {
    console.log('this is the encrypted data', dataEncrypted.toString());
    const returnedData = await decryptData(
      dataEncrypted.toString(),
      typeof dataEncrypted.toString(),
    );
    setDataDecrypted(returnedData);
  };
  const signMessageFn = async (message, privateKey) => {
    const signedData = await signMessage(message, privateKey);
    console.log('signed data', signedData);
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
      <Text>deviceA address: {deviceA}</Text>
      <Text>deviceB address: {deviceB}</Text>
      <Button
        title="Sign message"
        onPress={() => signMessageFn('hello this is a message', 'private Key')}
      />
      <Button title="encrypt data" onPress={encryptDataFn} />
      <Text>Encrypted Data: {dataEncrypted}</Text>
      <Button title="decrypt data" onPress={verifySign} />
      <Text>Decrypted Data: {dataDecrypted}</Text>
    </>
  );
};
export default App;
