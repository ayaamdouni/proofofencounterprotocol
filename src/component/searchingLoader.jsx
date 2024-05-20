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
    <View style={styles.shadowStyle}>
      <View style={styles.shadowStyle1}>
        <View style={styles.shadowStyle2}>
          <Text>Scanning</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowStyle: {
    height: 200,
    width: 200,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'black',
    elevation: 80,
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
    borderColor: 'black',
    justifyContent: 'center',
    // elevation: 70,
    // color: 'black',
  },
  shadowStyle2: {
    height: 140,
    width: 140,
    alignSelf: 'center',
    borderRadius: 140 / 2,
    borderWidth: 3,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 70,
    backgroundColor: 'black',
  },
});

export default SearchingLoader;
