import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import SearchingLoader from './src/component/searchingLoader';
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
import {verifySign} from './src/verifySignature';

const {NearbyConnectionModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
const projectId = PROJECTID;
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
export default function App() {
  const {open, isConnected, provider, address} = useWalletConnectModal();
  const [deviceA, setDeviceA] = useState('');
  const [deviceB, setDeviceB] = useState('');
  const [localIncrementalIndexA, setLocalIncrementalIndexA] = useState(44);
  const [localIncrementalIndexB, setLocalIncrementalIndexB] = useState(35);
  const [bTimestamp, setbTimestamp] = useState('2000');
  const [aTimestamp, setaTimestamp] = useState('5000');
  const [TEncounterID, setTEncounterID] = useState('');
  const [TencounterIDretrieved, setTencounterIDretrieved] = useState('');
  const [FEncounterID, setFEncounterID] = useState('');
  const [encounterIndex, setEncounterIndex] = useState('');
  const [connectedEndpoint, setConnectedEndpooit] = useState('');
  const [isDiscoverer, setisDiscoverer] = useState(false);
  const [isAdvertiser, setisAdvertiser] = useState(false);
  const [hashInit, setHashInit] = useState('');
  const [dataEncrypted, setEncryptedData] = useState('');
  const [dataDecrypted, setDataDecrypted] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
      'https://sepolia.infura.io/v3/777255a92575483a9ec9116de0833863',
    ),
  });
  useEffect(() => {
    let EventListener = eventEmitter.addListener(
      'connectedToEndpointB',
      event => {
        setConnectedEndpooit(event.endpointId);
        console.log('device A connected to an endpointID B', connectedEndpoint);
      },
    );
  }, []);
  useEffect(() => {
    let EventListener = eventEmitter.addListener(
      'connectedToEndpointA',
      event => {
        setConnectedEndpooit(event.endpointId);
        console.log('device B connected to an endpointID A', connectedEndpoint);
      },
    );
  }, []);
  const unwatch = publicClient.watchEvent({
    address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
    onLogs: logs => {
      console.log(parseInt(logs[0].data, 16));
      setEncounterIndex(parseInt(logs[0].data, 16));
    },
  });
  useEffect(() => {
    let EventListener = eventEmitter.addListener(
      'MessageReceivedEvent',
      event => {
        console.log('New Message Received:', event.MessageReceived);
        if (
          event.MessageReceived.charAt(event.MessageReceived.length - 1) === '1'
        ) {
          console.log('generating TEncounterID and initing encounter Tx');
          setDeviceA(event.MessageReceived.split(' ')[0]);
          generateTEncounterID(localIncrementalIndexA, localIncrementalIndexB);
        }
        if (
          event.MessageReceived.charAt(event.MessageReceived.length - 1) === '2'
        ) {
          console.log(
            'message received to retrieve TEncounterID:',
            event.MessageReceived,
          );
          setReceivedMessage(event.MessageReceived);
          decryptDataFn(event.MessageReceived.slice(0, -1), 'privateKeyA');
        }
      },
    );
    return () => {
      EventListener.remove();
    };
  });

  useEffect(() => {
    if (dataDecrypted) {
      setDeviceB(dataDecrypted.split(':')[0]);
      setTEncounterID(dataDecrypted.split(':')[1]);
    }
  }, [dataDecrypted]);

  useEffect(() => {
    if (
      isDiscoverer &&
      encounterIndex &&
      deviceA &&
      bTimestamp &&
      receivedMessage
    ) {
      retrieveTEncounterFN(encounterIndex, deviceA, bTimestamp, provider);
    }
  }, [encounterIndex, deviceA, receivedMessage]);

  useEffect(() => {
    if (isDiscoverer && TEncounterID && TencounterIDretrieved) {
      verifySignFN(
        TEncounterID,
        TencounterIDretrieved.substring(2),
        'publickeyB',
      );
      generateFEncounterID(TEncounterID, aTimestamp);
    }
  }, [TencounterIDretrieved]);

  useEffect(() => {
    if (
      deviceA &&
      isAdvertiser &&
      TEncounterID &&
      bTimestamp &&
      connectedEndpoint
    ) {
      // console.log(
      //   'you can init encounter Tx:',
      //   deviceA,
      //   TEncounterID,
      //   bTimestamp,
      // );
      initEncounter(
        provider,
        address,
        deviceA,
        TEncounterID,
        bTimestamp,
        connectedEndpoint,
        localIncrementalIndexB,
      );
    }
  }, [TEncounterID, address, bTimestamp, deviceA]);

  useEffect(() => {
    if (
      deviceB &&
      isDiscoverer &&
      TEncounterID &&
      aTimestamp &&
      encounterIndex &&
      connectedEndpoint
    ) {
      finalizeEncounter(
        provider,
        address,
        encounterIndex,
        deviceB,
        FEncounterID,
        aTimestamp,
        connectedEndpoint,
        localIncrementalIndexB,
      );
    }
  }, [FEncounterID, address, aTimestamp, deviceB, encounterIndex]);

  const generateTEncounterID = (indexA, indexB) => {
    const TEncounter = indexA ^ indexB;
    console.log('TEncounterID generated', TEncounter);
    setTEncounterID(TEncounter);
  };
  const generateFEncounterID = (tencounterp, aTimestampp) => {
    const FEncounter = tencounterp ^ aTimestampp;
    console.log('FEncounterID generated', FEncounter);
    setFEncounterID(FEncounter);
  };
  const retrieveTEncounterFN = useCallback(
    async (encounterIndexp, didBp, bTimestampp, providerp) => {
      const TEncounterRetrieved = await retrieveTEncounterIDFunction(
        encounterIndexp,
        didBp,
        bTimestampp,
        providerp,
      );
      setTencounterIDretrieved(TEncounterRetrieved);
    },
    [],
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

  const decryptDataFn = useCallback(async (encryptedDatap, publicKeyp) => {
    const decrypted = await decryptData(encryptedDatap, publicKeyp);
    setDataDecrypted(decrypted);
  }, []);

  const verifySignFN = useCallback(
    async (tencounterp, signaturep, publicKeyp) => {
      const resultVerify = await verifySign(
        tencounterp,
        signaturep,
        publicKeyp,
      );
      return resultVerify;
    },
    [],
  );

  const startDiscovering = () => {
    setDeviceA(address);
    setisDiscoverer(true);
    setLocalIncrementalIndexA(5);
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
  const advertisingFN = () => {
    isAdvertiser ? stopAdvertising() : startAdvertising();
  };
  const discoveringFN = () => {
    isDiscoverer ? stopDiscovering() : startDiscovering();
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={{alignSelf: 'stretch'}}>
        <WalletConnectModal
          projectId={projectId}
          providerMetadata={providerMetadata}
        />
        <View style={styles.elements}>
          <View style={styles.topContainer}>
            <View>
              <Text style={styles.title}>Proof of Encounter</Text>
            </View>
          </View>

          <View style={styles.topContainer}>
            <SearchingLoader />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={discoveringFN}>
              <Text style={styles.buttonText}>
                {isDiscoverer ? 'Stop Discovering' : 'Discover'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={advertisingFN}>
              <Text style={styles.buttonText}>
                {isAdvertiser ? 'Stop Advertising' : 'Advertise'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <TouchableOpacity style={styles.connectButton} onPress={onPress}>
        <Text style={styles.connectbuttonText}>
          {isConnected ? 'Disconnect your wallet' : 'Connect your wallet'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEE9FD',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  elements: {
    marginHorizontal: 32,
    marginTop: 42,
    flexDirection: 'column',
    // alignItems: 'center',
  },
  headerTop: {
    color: 'gray',
    fontWeight: '800',
  },
  scanningContainer: {
    marginVertical: 32,
    alignItems: 'center',
    // backgroundColor: "black"
  },
  buttonStyle: {
    width: 300,
    height: 300,
    color: 'black',
    borderRadius: 150,
    borderColor: '#D7E1F3',
    borderWidth: 10,
  },
  title: {
    fontSize: 25,
    color: '#6C7A93',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  artist: {
    fontSize: 14,
    marginTop: 6,
    color: 'gray',
    fontWeight: '500',
  },
  button: {
    width: 144,
    height: 48,
    borderRadius: 240,
    fontSize: 15,
    fontFamily: 'Roboto',
    borderWidth: 0,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    elevation: 10,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'monospace',
    color: '#6C7A93',
  },

  connectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderRightColor: '#252525',
    borderBottomColor: '#252525',
    // borderColor: '#252525',
    backgroundColor: '#FAFAFA',
    // marginVertical: 35,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  connectbuttonText: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: '#6C7A93',
    textTransform: 'uppercase',
  },
});
