import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can choose any icon set you prefer
import themeStyle, { FONT } from '../styles/themeStyle';

export default function PasswordInput({ title, hint, onChangeText }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.containerMain}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.container}>

        <TextInput
          style={styles.input}
          placeholder={hint}
          placeholderTextColor={themeStyle.TEXT_GREY}
          secureTextEntry={!showPassword}
          // value={password}
          onChangeText={onChangeText}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={toggleShowPassword}>
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={24}
            color={themeStyle.TEXT_GREY}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 6,
    height: 50,
    marginHorizontal: '5%',
    paddingLeft: 15,
    marginTop: '2%',
    width: '90%'
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
  },
  iconContainer: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
    marginLeft: '5%',
    marginTop: '5%'
  },
  containerMain: {}
});
