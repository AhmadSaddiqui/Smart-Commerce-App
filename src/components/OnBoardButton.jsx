import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';

export default function OnBoardButton({title,marginTop,onPress}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button,{marginTop:marginTop}]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderColor: themeStyle.WHITE,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
  },
  buttonText: {
    fontSize: 18,
    color: themeStyle.WHITE,
    fontFamily: FONT.ManropeSemiBold,
  },
});
