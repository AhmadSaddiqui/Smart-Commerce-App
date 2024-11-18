import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import { WaveIndicator, } from 'react-native-indicators';
export default function GlobalButton({ title, marginTop, onPress, height, loading, marginLeft, otherStyles, textOtherStyle }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, otherStyles, { marginTop: marginTop, marginLeft: marginLeft, height: height ? height : 50 }]}>
      {
        loading ? (
          <WaveIndicator color={themeStyle.WHITE} />
        ) : (
          <Text style={[styles.buttonText, textOtherStyle]}>{title}</Text>
        )
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: themeStyle.WHITE,
    fontFamily: FONT.ManropeSemiBold,
  },
});
