// components/CustomSpinner.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const CustomSpinner = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animasi berulang
    Animated.loop(
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [rotateAnim, scaleAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        { transform: [{ rotate }, { scale: scaleAnim }] },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    width: 60,
    height: 60,
    borderWidth: 6,
    borderRadius: 30,
    borderTopColor: '#8B1E1E',
    borderRightColor: 'transparent',
    borderBottomColor: '#8B1E1E',
    borderLeftColor: 'transparent',
  },
});

export default CustomSpinner;
