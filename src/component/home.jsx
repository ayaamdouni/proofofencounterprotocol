import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const Home = () => {
  return (
    <View>
      <Button title="hello"/>
      <LinearGradient
        colors={['purple', 'white']}
        style={styles.container}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Text style={styles.text}>Home Screen</Text>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'red',
  },
});
export default Home;
