import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import {WaveIndicator,} from 'react-native-indicators';
export default function GlobalButton2({title,marginTop,onPress,height,loading}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button,{marginTop:marginTop,height:height ? height : 50}]}>
   {
    loading ? (
      <WaveIndicator color={themeStyle.WHITE}/>
    ):(
      <Text style={styles.buttonText}>{title}</Text>
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
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:themeStyle.PRIMARY_COLOR
  },
  buttonText: {
    fontSize: 18,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeSemiBold,
  },
});
