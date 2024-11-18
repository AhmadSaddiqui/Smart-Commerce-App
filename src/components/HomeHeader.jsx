import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function HomeHeader({onPress}) {
  const navigation = useNavigation()
  const [loading, setloading] = useState(true)
    const [addresses, setAddresses] = useState([]);
  const fetchAddresses = async () => {
    const restuarantId = await AsyncStorage.getItem('restuarantId');
    
    try {
        const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/address/${restuarantId}`);
        const result = await response.json();
        setAddresses(result);
        setloading(false)
        console.log(result)
    } catch (error) {
        console.error(error);
        setloading(false)
    }
};
  useFocusEffect((
    useCallback(()=>{
      fetchAddresses();

    },[])
  ))

  return (
    <View style={styles.headerContainer}>
      <Image resizeMode='contain' style={{height:40,width:100,right:18}} source={require('../../assets/images/OnBoarding/logo.png')}/>
      {/* <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <Image style={styles.locIcon} source={require('../../assets/images/Home/loc.png')} />
          <Text style={styles.addressText}>Deliver to</Text>
          <Image style={styles.downIcon} source={require('../../assets/images/Home/down.png')} />
        </View>
        <Text style={styles.address}>{addresses[0]?.shippingAddress}</Text>
      </View> */}
      <TouchableOpacity onPress={onPress? () => navigation.openDrawer() : null}>
        <Image style={styles.dpIcon} source={require('../../assets/images/Splash/dp.png')} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginTop: '2%',
    justifyContent: 'space-between',
    alignItems:"center"
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
    marginLeft: '15%',
  },
  dpIcon: {
    height: 31,
    width: 31,
    borderRadius:20
  },
});
