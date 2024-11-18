import React, { useState, useRef } from 'react';
import { View, Text, Button, Animated, TouchableOpacity, StyleSheet } from 'react-native';

const CustomSnackbar = ({ message, visible, onDismiss, duration = 3000 }) => {
  const [show, setShow] = useState(visible);
  const translateY = useRef(new Animated.Value(100)).current;

  const showSnackbar = () => {
    setShow(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Hide the snackbar after the duration
    setTimeout(() => {
      hideSnackbar();
    }, duration);
  };

  const hideSnackbar = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShow(false);
      if (onDismiss) onDismiss();
    });
  };

  if (show) {
    return (
      <Animated.View style={[styles.snackbar, { transform: [{ translateY }] }]}>
        <Text style={styles.snackbarText}>{message}</Text>
        <TouchableOpacity onPress={hideSnackbar}>
          <Text style={styles.snackbarAction}>DISMISS</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snackbarText: {
    color: '#fff',
  },
  snackbarAction: {
    color: 'yellow',
    marginLeft: 20,
  },
});

export default CustomSnackbar;
