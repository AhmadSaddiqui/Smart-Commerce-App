// CustomRadioButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import themeStyle from '../styles/themeStyle';

const CustomRadioButton = ({ value, status, onPress }) => {
  return (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
      <View style={styles.radioButton}>
        {status === 'checked' && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.radioButtonText}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#757575',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: themeStyle.PRIMARY_COLOR,
  },
  radioButtonText: {
    fontSize: 16,
    color: '#757575',
  },
});

export default CustomRadioButton;
