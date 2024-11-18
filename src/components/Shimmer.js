import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import themeStyle from '../styles/themeStyle';

const Shimmer = ({ style }) => {
  const shimmerOpacity = useRef(new Animated.Value(0)).current;
  const shimmerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.parallel([
        Animated.timing(shimmerOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerScale, {
          toValue: 1.5,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmerOpacity, shimmerScale]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.6],
            }),
            transform: [
              {
                translateX: shimmerOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-200, 200],
                }),
              },
              {
                scale: shimmerScale,
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    backgroundColor: themeStyle.dullgrey,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

export default Shimmer;
