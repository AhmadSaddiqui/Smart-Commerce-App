import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import themeStyle from '../styles/themeStyle';

const CustomSwitch = ({ isOn, onToggle }) => {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const toggleSwitch = () => {
    onToggle(!isOn);
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', '#fff'],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} style={styles.switchContainer}>
      <Animated.View style={[styles.switch, { backgroundColor }]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 35,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    justifyContent: 'center',
    padding: 3,
    elevation: 2
  },
  knob: {
    width: 14,
    height: 14,
    borderRadius: 12,
    backgroundColor: themeStyle.PRIMARY_COLOR,
    elevation: 3, // To add a shadow for Android
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default CustomSwitch;
