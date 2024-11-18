import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';

export default function AuthHeader({title,description,marginTop}) {
  return (
    <View style={[{top:marginTop}]}>
      <Image style={styles.logo} source={require('../../assets/images/OnBoarding/logo.png')} />
      <Text style={styles.welcomeText}>{title}</Text>
      <Text style={styles.descriptionText}>
      {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 68,
    width: 111,
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: 22,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
    alignSelf: 'center',
    marginTop: '5%',
  },
  descriptionText: {
    fontSize: 14,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeSemiBold,
    alignSelf: 'center',
    marginTop: '2%',
    textAlign:'center'
  },
});
