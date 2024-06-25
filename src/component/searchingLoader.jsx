import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';

const SearchingLoader = () => {
  return (
    <View style={styles.shadowmainStyle}>
      <View style={styles.shadowStyle}>
        <View style={styles.shadowStyle1}>
          <View style={styles.shadowStyle2}>
            <Text style={styles.textStyle}>SCANNING...</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowmainStyle: {
    height: 240,
    width: 240,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: 120,
    borderWidth: 3,
    borderColor: '#2234AE',
    elevation: 200,
    // color: 'black',
    justifyContent: 'center',
  },
  shadowStyle: {
    height: 200,
    width: 200,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#2234AE',
    // elevation: 200,
    // color: 'black',
    justifyContent: 'center',
  },
  shadowStyle1: {
    height: 170,
    width: 170,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: 170 / 2,
    borderWidth: 3,
    borderColor: '#2234AE',
    justifyContent: 'center',
    opacity: 0.7,
    // elevation: 90,
    // color: 'black',
  },
  shadowStyle2: {
    height: 140,
    width: 140,
    alignSelf: 'center',
    borderRadius: 140 / 2,
    borderWidth: 3,
    borderColor: '#91A6FF',
    // borderColor: '#40c9ff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
    // elevation: 70,
    backgroundColor: '#91A6FF',
  },
  textStyle: {
    fontSize: 15,
    fontFamily: 'monospace',
    color: 'white',
    fontWeight: 'bold'
  },
});

export default SearchingLoader;
