// import React from 'react';
// import { SafeAreaView, StyleSheet, View } from 'react-native';
// import { Button, Text, Appbar } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const App = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <Appbar.Header style={styles.header}>
//         <Appbar.Content title="Metamask Connector" />
//       </Appbar.Header>
//       <View style={styles.content}>
//         <Icon name="ethereum" size={100} color="#4CAF50" style={styles.icon} />
//         <Text style={styles.title}>Welcome to DApp</Text>
//         <Button 
//           icon="wallet" 
//           mode="contained" 
//           style={styles.button} 
//           onPress={() => console.log('Connect to Metamask')}
//         >
//           Connect to Metamask
//         </Button>
//         <Button 
//           icon="wifi" 
//           mode="contained" 
//           style={styles.button} 
//           onPress={() => console.log('Start Discovering')}
//         >
//           Start Discovering
//         </Button>
//         <Button 
//           icon="broadcast" 
//           mode="contained" 
//           style={styles.button} 
//           onPress={() => console.log('Start Advertising')}
//         >
//           Start Advertising
//         </Button>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#6200ee',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   icon: {
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 40,
//   },
//   button: {
//     marginVertical: 10,
//     width: '80%',
//   },
// });

// export default App;
