import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';

export default function GlobalInput({ title, hint, marginTop, width, keyboardType, onChangeText, value, right }) {
  return (
    <View style={[styles.container, { marginTop: marginTop, width: width, right: right }]}>
      <Text style={styles.label}>{title}</Text>
      <TextInput
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor={themeStyle.TEXT_GREY}
        placeholder={hint}
        value={value}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '4%',
  },
  label: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
  },
  input: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 6,
    marginTop: '3%',
    paddingLeft: 20,
  },
});
