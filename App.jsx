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
import {createPublicClient, http, custom} from 'viem';
import {NativeModules, NativeEventEmitter} from 'react-native';
import {PROJECTID} from '@env';
import {initEncounter} from './src/transactions/initEncounter';
import {finalizeEncounter} from './src/transactions/finalizeEncounter';
import {retrieveTEncounterIDFunction} from './src/transactions/retrieveTEncounterID';
import {retrieveFEncounterIDFunction} from './src/transactions/retrieveFEncounterID';
import {decryptData} from './src/services/decryptData';
import {verifySign} from './src/services/verifySignature';
import LinearGradient from 'react-native-linear-gradient';
import Card from './src/component/card';
import {testPrivate} from './src/transactions/testPrivateKey';
import Scale from './src/component/scaleAnimations';

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
  const [bTimestamp, setbTimestamp] = useState('');
  const [aTimestamp, setaTimestamp] = useState('');
  const [TEncounterID, setTEncounterID] = useState('');
  const [TencounterIDretrieved, setTencounterIDretrieved] = useState('');
  const [FEncounterID, setFEncounterID] = useState('');
  const [FencounterIDretrieved, setFencounterIDretrieved] = useState('');
  const [encounterIndex, setEncounterIndex] = useState('');
  const [connectedEndpoint, setConnectedEndpooit] = useState('');
  const [isDiscoverer, setisDiscoverer] = useState(false);
  const [isAdvertiser, setisAdvertiser] = useState(false);
  const [dataDecrypted, setDataDecrypted] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  // declaring variables for counting time of each section
  const [initStart, setInitStart] = useState();
  const [initEnd, setInitEnd] = useState();
  const [ProofStart, setProofStart] = useState();
  const [ProofEnd, setProofEnd] = useState();
  const [FinalStart, setFinalStart] = useState();
  const [FinalEnd, setFinalEnd] = useState();
  const publicClient = createPublicClient({
    chain: fantomTestnet,
    transport: custom(provider),
  });
  // const publicClient = createPublicClient({
  //   chain: sepolia,
  //   transport: http(
  //     'https://sepolia.infura.io/v3/777255a92575483a9ec9116de0833863',
  //   ),
  // });
  useEffect(() => {
    let EventListener = eventEmitter.addListener(
      'connectedToEndpointB',
      event => {
        setConnectedEndpooit(event.endpointId);
        // console.log('device A connected to an endpointID B', connectedEndpoint);
      },
    );
  }, []);
  useEffect(() => {
    let EventListener = eventEmitter.addListener(
      'connectedToEndpointA',
      event => {
        setConnectedEndpooit(event.endpointId);
        // console.log('device B connected to an endpointID A', connectedEndpoint);
      },
    );
  }, []);
  const unwatch = publicClient.watchEvent({
    address: '0x29eBB49C3f4d7988c9eA8E27A47e098f0252ce27',
    onLogs: logs => {
      // console.log(parseInt(logs[0].data, 16));
      setEncounterIndex(parseInt(logs[0].data, 16));
    },
  });
  useEffect(() => {
    let EventListener = eventEmitter.addListener(
      'MessageReceivedEvent',
      event => {
        // console.log('New Message Received:', event.MessageReceived);
        if (
          event.MessageReceived.charAt(event.MessageReceived.length - 1) === '1'
        ) {
          console.log(
            'new message received to generate TEncounterID and init encounter Tx',
          );
          setInitStart(new Date());
          setDeviceA(event.MessageReceived.split(' ')[0]);
          setaTimestamp(event.MessageReceived.split(' ')[1]);
          generateTEncounterID(localIncrementalIndexA, localIncrementalIndexB);
        }
        if (
          event.MessageReceived.charAt(event.MessageReceived.length - 1) === '2'
        ) {
          setProofStart(new Date());
          console.log(
            'new message received to retrieve TEncounterID:',
            event.MessageReceived,
          );
          setReceivedMessage(event.MessageReceived);
          decryptDataFn(event.MessageReceived.slice(0, -1), 'privateKeyA');
        }
        if (
          event.MessageReceived.charAt(event.MessageReceived.length - 1) === '3'
        ) {
          setFinalStart(new Date());
          console.log(
            'new message received to retrieve FEncounterID:',
            event.MessageReceived,
          );
          setReceivedMessage(event.MessageReceived);
          decryptDataFn(event.MessageReceived.slice(0, -1), 'privateKeyB');
        }
      },
    );
    return () => {
      EventListener.remove();
    };
  });

  useEffect(() => {
    if (dataDecrypted && isDiscoverer) {
      console.log('now divising the datadecrypted in the discoverer...');
      setDeviceB(dataDecrypted.split(':')[0]);
      setTEncounterID(dataDecrypted.split(':')[1]);
      setbTimestamp(dataDecrypted.split(':')[3]);
    }
  }, [dataDecrypted]);

  useEffect(() => {
    if (dataDecrypted && isAdvertiser) {
      setFEncounterID(dataDecrypted.split(':')[0]);
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
      console.log('retrieving tencounterID');
      retrieveTEncounterFN(encounterIndex, deviceA, bTimestamp, provider);
    } else if (isDiscoverer) {
      console.log(
        'retrieving tencounterID missed params:',
        encounterIndex,
        deviceA,
        bTimestamp,
      );
    }
  }, [encounterIndex, deviceA, receivedMessage, bTimestamp]);

  useEffect(() => {
    if (
      isAdvertiser &&
      encounterIndex &&
      deviceB &&
      aTimestamp &&
      receivedMessage
    ) {
      retrieveFEncounterFN(encounterIndex, deviceB, aTimestamp, provider);
    }
  }, [encounterIndex, deviceB, receivedMessage, aTimestamp]);

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
    if (isAdvertiser && FEncounterID && FencounterIDretrieved) {
      verifySignFN(
        FEncounterID,
        FencounterIDretrieved.substring(2),
        'publickeyA',
      );
      setFinalEnd(new Date());
    }
  }, [FencounterIDretrieved]);
  useEffect(() => {
    if (FinalEnd) {
      console.log('The start of final start is: ', FinalStart.toISOString());
      console.log('The time of end final part is:', FinalEnd.toISOString());
      console.log('Duration of final part is: ', FinalEnd - FinalStart);
      console.log('THE END !');
      disconnect();
    }
  }, [FinalEnd]);

  useEffect(() => {
    if (
      deviceA &&
      isAdvertiser &&
      TEncounterID &&
      bTimestamp &&
      connectedEndpoint
    ) {
      initEncounter(
        provider,
        address,
        deviceA,
        TEncounterID,
        bTimestamp,
        connectedEndpoint,
        localIncrementalIndexB,
        initStart,
      );
    }
  }, [TEncounterID, address, bTimestamp, deviceA]);

  useEffect(() => {
    if (
      deviceB &&
      isDiscoverer &&
      FEncounterID &&
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
        ProofStart,
      );
    }
  }, [FEncounterID, address, aTimestamp, deviceB, encounterIndex]);

  const generateTEncounterID = (indexA, indexB) => {
    const TEncounter = indexA ^ indexB;
    // console.log('TEncounterID generated', TEncounter);
    setTEncounterID(TEncounter);
  };
  const generateFEncounterID = (tencounterp, aTimestampp) => {
    const FEncounter = tencounterp ^ aTimestampp;
    // console.log('FEncounterID generated', FEncounter);
    setFEncounterID(FEncounter);
  };
  const retrieveTEncounterFN = useCallback(
    async (encounterIndexp, didAp, bTimestampp, providerp) => {
      const TEncounterRetrieved = await retrieveTEncounterIDFunction(
        encounterIndexp,
        didAp,
        bTimestampp,
        providerp,
      );
      setTencounterIDretrieved(TEncounterRetrieved);
    },
    [],
  );

  const retrieveFEncounterFN = useCallback(
    async (encounterIndexp, didBp, aTimestampp, providerp) => {
      const FEncounterRetrieved = await retrieveFEncounterIDFunction(
        encounterIndexp,
        didBp,
        aTimestampp,
        providerp,
      );
      setFencounterIDretrieved(FEncounterRetrieved);
    },
    [],
  );

  useEffect(() => {
    if (deviceA && isDiscoverer && aTimestamp) {
      console.log('device A:', deviceA, aTimestamp, localIncrementalIndexA);
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
    setaTimestamp(Math.round(new Date().getTime() / 1000).toString());
  };
  const startAdvertising = () => {
    setDeviceB(address);
    setisAdvertiser(true);
    setbTimestamp(Math.round(new Date().getTime() / 1000).toString());
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
  const disconnect = () => {
    NearbyConnectionModule.disconnectFromEndpoint(connectedEndpoint);
    setDeviceA('');
    setDeviceB('');
    setaTimestamp('');
    setbTimestamp('');
    setConnectedEndpooit('');
    setDataDecrypted('');
    setEncounterIndex('');
    setFEncounterID('');
    setFencounterIDretrieved('');
    setFinalEnd('');
    setInitStart('');
    setTEncounterID('');
    setTencounterIDretrieved('');
    setReceivedMessage('');
  };

  const onPress = () => {
    if (isConnected) {
      provider.disconnect();
    } else {
      open();
    }
  };

  const testPrivateKey = () => {
    testPrivate(provider);
  };

  return (
    <LinearGradient
      colors={['#191714', '#2234AE']}
      // colors={['#3b8d99', '#aa4b6b']}
      // colors={['black', '#6A82FB']}
      style={styles.gradientContainer}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <Card />
      <SafeAreaView style={{alignSelf: 'stretch'}}>
        <WalletConnectModal
          projectId={projectId}
          providerMetadata={providerMetadata}
        />
        <View style={styles.elements}>
          <View style={styles.scanningContainer}>
            {/* <SearchingLoader /> */}
            <Scale />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={discoveringFN}>
              <LinearGradient
                // colors={['#40c9ff', 'white']}
                colors={['#DEE4EA', 'white']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.gradientBackground}
              />
              <Text style={styles.buttonText}>
                {isDiscoverer ? 'Stop Discovering' : 'Discover'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={advertisingFN}>
              {/* this button is to test the functionality of private key to get the account address */}
              {/* </TouchableOpacity><TouchableOpacity style={styles.button} onPress={testPrivateKey}> */}
              <LinearGradient
                // colors={['#40c9ff', 'white']}
                colors={['#DEE4EA', 'white']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.gradientBackground}
              />
              <Text style={styles.buttonText}>
                {/* {'test private key'} */}
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
    </LinearGradient>

    // <View style={styles.container}>
    //   <SafeAreaView style={{alignSelf: 'stretch'}}>
    //     <WalletConnectModal
    //       projectId={projectId}
    //       providerMetadata={providerMetadata}
    //     />
    //     <View style={styles.elements}>
    //       <View style={styles.topContainer}>
    //         <View>
    //           <Text style={styles.title}>Proof of Encounter</Text>
    //         </View>
    //       </View>

    //       <View style={styles.scanningContainer}>
    //         <SearchingLoader />
    //       </View>

    //       <View style={styles.buttonsContainer}>
    //         <TouchableOpacity style={styles.button} onPress={discoveringFN}>
    //           <Text style={styles.buttonText}>
    //             {isDiscoverer ? 'Stop Discovering' : 'Discover'}
    //           </Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.button} onPress={advertisingFN}>
    //           <Text style={styles.buttonText}>
    //             {isAdvertiser ? 'Stop Advertising' : 'Advertise'}
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </SafeAreaView>
    //   <TouchableOpacity style={styles.connectButton} onPress={onPress}>
    //     <Text style={styles.connectbuttonText}>
    //       {isConnected ? 'Disconnect your wallet' : 'Connect your wallet'}
    //     </Text>
    //   </TouchableOpacity>
    // </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  },
  headerTop: {
    color: 'gray',
    fontWeight: '800',
  },
  scanningContainer: {
    marginVertical: 95,
    alignItems: 'center',
    // backgroundColor: "black"
  },
  title: {
    fontSize: 25,
    color: '#f0f0f0',
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
    width: 150,
    height: 50,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: 'Roboto',
    borderWidth: 0,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    elevation: 10,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'monospace',
    color: '#6C7A93',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  connectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    // borderRightWidth: 3,
    // borderBottomWidth: 3,
    borderRightColor: '#252525',
    borderBottomColor: '#252525',
    // borderColor: '#252525',
    backgroundColor: '#FAFAFA',
    // marginVertical: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 10,
  },
  connectbuttonText: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: '#6C7A93',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  gradientBackground: {
    position: 'absolute',
    left: -5,
    top: -5,
    width: 360,
    height: 160,
    borderRadius: 8,
  },
});
