import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';

const SearchingLoader = () => {
  const scaleAnimate = useRef(new Animated.Value(1)).current;
  const opacityAnimate = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnimate, {
              toValue: 1.2,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnimate, {
              toValue: 0.5,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnimate, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnimate, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animate();
  }, [scaleAnimate, opacityAnimate]);

  const animatedStyle = {
    transform: [{scale: scaleAnimate}],
    opacity: opacityAnimate,
  };

  return (
    <Animated.View style={[styles.shadowmainStyle, animatedStyle]}>
      <Animated.View style={[styles.shadowStyle, animatedStyle]}>
        <View style={[styles.shadowStyle1]}>
          <View style={styles.shadowStyle2}>
            <Text style={styles.textStyle}>SCANNING...</Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowmainStyle: {
    height: 240,
    width: 240,
    backgroundColor: '#2234AE',
    alignSelf: 'center',
    borderRadius: 120,
    borderWidth: 3,
    borderColor: '#2234AE',
    elevation: 200,
    justifyContent: 'center',
  },
  shadowStyle: {
    height: 200,
    width: 200,
    backgroundColor: '#6DADDB',
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#6DADDB',
    justifyContent: 'center',
  },
  shadowStyle1: {
    height: 170,
    width: 170,
    backgroundColor: '#91A6FF',
    alignSelf: 'center',
    borderRadius: 170 / 2,
    borderWidth: 3,
    borderColor: '#91A6FF',
    justifyContent: 'center',
    opacity: 0.7,
  },
  shadowStyle2: {
    height: 140,
    width: 140,
    alignSelf: 'center',
    borderRadius: 140 / 2,
    borderWidth: 3,
    borderColor: '#91A6FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
    backgroundColor: '#91A6FF',
  },
  textStyle: {
    fontSize: 15,
    fontFamily: 'monospace',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchingLoader;
