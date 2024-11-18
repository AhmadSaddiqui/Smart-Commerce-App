import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { useNavigation } from '@react-navigation/native'

export default function HomeHeaderSupplier({onPress}) {
  const navigation = useNavigation()
  return (
    <View style={styles.headerContainer}>
      <Image resizeMode='contain' style={{height:40,width:100,right:18}} source={require('../../assets/images/OnBoarding/logo.png')}/>

      {/* <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <Image style={styles.locIcon} source={require('../../assets/images/Home/loc.png')} />
          <Text style={styles.addressText}>Deliver to</Text>
          <Image style={styles.downIcon} source={require('../../assets/images/Home/down.png')} />
        </View>
        <Text style={styles.address}>Soekarno Hatta 15A Malang</Text>
      </View> */}
      <TouchableOpacity onPress={onPress}>
        <Image style={styles.dpIcon} source={require('../../assets/images/Splash/dp.png')} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginTop: '5%',
    justifyContent: 'space-between',

  },
  addressContainer: {},
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locIcon: {
    width: 12,
    height: 16,
  },
  addressText: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
  },
  downIcon: {
    width: 10,
    height: 8,
    marginLeft: '5%',
  },
  address: {
    fontSize: 16,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    marginLeft: '10%',
  },
  dpIcon: {
    height: 31,
    width: 31,
    borderRadius:20
  },
});
