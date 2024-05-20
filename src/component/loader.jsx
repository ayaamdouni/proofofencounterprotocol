import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';

const Loader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loader}>
      <View style={styles.loaderBefore} />
      <View style={styles.loaderAfter} />
      <Animated.View style={[styles.loaderSpan, {transform: [{rotate}]}]}>
        <View style={styles.loaderSpanBefore} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: 'relative',
    width: 150,
    height: 150,
    backgroundColor: 'transparent',
    borderRadius: 75,
    boxShadow: '25px 25px 75px rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loaderBefore: {
    content: '',
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 65,
    borderStyle: 'dashed',
    boxShadow:
      'inset -5px -5px 25px rgba(0,0,0,0.25), inset 5px 5px 35px rgba(0,0,0,0.25)',
  },
  loaderAfter: {
    content: '',
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#444',
    borderStyle: 'dashed',
    boxShadow:
      'inset -5px -5px 25px rgba(0,0,0,0.25), inset 5px 5px 35px rgba(0,0,0,0.25)',
  },
  loaderSpan: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '50%',
    height: '100%',
    backgroundColor: 'transparent',
    transformOrigin: 'top left',
    borderTopWidth: 1,
    borderTopColor: '#fff',
    borderStyle: 'dashed',
  },
  loaderSpanBefore: {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'seagreen',
    transformOrigin: 'top left',
    transform: [{rotate: '-55deg'}],
    filter: 'blur(30px) drop-shadow(20px 20px 20px seagreen)',
  },
});

export default Loader;
