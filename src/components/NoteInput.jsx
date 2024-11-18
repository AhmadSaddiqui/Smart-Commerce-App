import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';

export default function NoteInput({title,hint,marginTop,onChangeText,value}) {
  return (
    <View style={[styles.container,{marginTop:marginTop}]}>
      <Text style={styles.label}>{title}</Text>
      <TextInput
      value={value}
        onChangeText={onChangeText}
        style={styles.input}
numberOfLines={4}
textAlignVertical='top'
multiline
        placeholderTextColor={themeStyle.TEXT_GREY}
        placeholder={hint}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '5%',
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
    height: 132,
    width: '100%',
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 6,
    marginTop: '3%',
    paddingLeft: 20,
  },
});
