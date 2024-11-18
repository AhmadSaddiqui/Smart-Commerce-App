import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import {CountryPicker} from "react-native-country-codes-picker";
import Flags from 'react-native-flags';
export default function CountryInput({title,hint,marginTop,width}) {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('🇮🇳');
  const [countryflag, setCountryflag] = useState('+91');

  return (
    <View style={[styles.container,{marginTop:marginTop,width:width}]}>
      <Text style={styles.label}>{title}</Text>
      <CountryPicker
        show={show}
        pickerButtonOnPress={(item) => {
            console.log(item)
          setCountryCode(item.flag);
          setCountryflag(item.dial_code)
          setShow(false);
          
        }}
      />

<View  style={{flexDirection:'row',alignItems:'center'}}> 
<TouchableOpacity
        onPress={() => setShow(true)}
        style={{
            width: '15%',
            height: 50,
            borderColor: themeStyle.TEXT_GREY,
            borderWidth:1,
            borderRadius:5,
    marginTop: '3%',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row'

        }}
      >
    {/* show flag here */}
 
        <Text style={{
            color: themeStyle.BLACK,
            fontSize: 10
        }}>
            {countryCode}
        </Text>
        <Text style={{
            color: themeStyle.BLACK,
            fontSize: 10,
            marginLeft:'5%'
        }}>
            {countryflag}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholderTextColor={themeStyle.TEXT_GREY}
        placeholder={hint}
        keyboardType='numeric'
      />
</View>
      
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
    height: 50,
    width: '80%',
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 6,
    marginTop: '3%',
    paddingLeft: 20,
    marginLeft:"2%"
  },
});
