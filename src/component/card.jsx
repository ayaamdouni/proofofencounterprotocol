import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Card = () => {
  return (
    <View style={styles.cardContainer}>
      {/* <LinearGradient
        // colors={['#40c9ff', 'white']}
        colors={['blue', 'white']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}
      /> */}
      <View style={styles.card}>
        <Text style={styles.title}>Proof Of Encounter</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    top: 55,
    width: 350,
    height: 150,
    // margin: 5,
  },
  title: {
    fontSize: 25,
    color: '#f0f0f0',
    fontWeight: '800',
    fontFamily: 'JerseyRegular',
  },
  gradientBackground: {
    position: 'absolute',
    left: -5,
    top: -5,
    width: 360,
    height: 160,
    borderRadius: 10,
  },
  card: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    // padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
  },
});

export default Card;
