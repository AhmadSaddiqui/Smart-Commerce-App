import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { ROUTES } from '../routes/RoutesConstants'
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function UserDrawer({ navigation }) {
  const cartItems = useSelector(state => state.cart.items);
  const [restaurant, setrestaurant] = useState({})
  const handleLogout = async () => {
    await AsyncStorage.removeItem('restuarantToken')
    await AsyncStorage.removeItem('restuarantId')
    navigation.replace(ROUTES.UserSignin)
  }

  const getRestuarant = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');

    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      const response = await fetch(`${BaseurlBuyer}${buyerId}`, requestOptions)
      const result = await response.json()
      setrestaurant(result)
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect((
    useCallback(() => {
      getRestuarant()
    }, [])
  ))
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* <Image style={styles.profileImage} source={require('../../assets/images/Splash/dp.png')} /> */}
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName} numberOfLines={1}>{restaurant?.name}</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>{restaurant?.email}</Text>
          </View>
        </View>


      </View>

      <View style={styles.menu}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.EditProfile)} style={styles.menuItem}>
          <Image style={styles.menuIcon} source={require('../../assets/icons/Drawer/user.png')} />
          <Text style={styles.menuText}>Personal Info</Text>
          <Image resizeMode='contain' style={styles.menuIconforward} source={require('../../assets/icons/Drawer/forward.png')} />
        </TouchableOpacity>


        {/* <TouchableOpacity onPress={()=>navigation.navigate('Address')} style={[styles.menuItem,{marginTop:'8%'}]}>
          <Image resizeMode='contain' style={styles.menuIcon} source={require('../../assets/icons/Drawer/map.png')} />
          <Text style={styles.menuText}>Addresses</Text>
          <Image resizeMode='contain' style={styles.menuIconforward} source={require('../../assets/icons/Drawer/forward.png')} />
        </TouchableOpacity> */}


        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={[styles.menuItem, { marginTop: '15%' }]}>
          <Image resizeMode='contain' style={styles.menuIcon} source={require('../../assets/icons/Drawer/cart.png')} />
          <Text style={styles.menuText}>Cart</Text>
          <Image resizeMode='contain' style={styles.menuIconforward} source={require('../../assets/icons/Drawer/forward.png')} />
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate('Favourites')} style={[styles.menuItem, { marginTop: '8%' }]}>
          <Image resizeMode='contain' style={styles.menuIcon} source={require('../../assets/icons/Drawer/fav.png')} />
          <Text style={styles.menuText}>Favourite</Text>
          <Image resizeMode='contain' style={styles.menuIconforward} source={require('../../assets/icons/Drawer/forward.png')} />
        </TouchableOpacity>


       





        <TouchableOpacity onPress={() => navigation.navigate('Orders')} style={[styles.menuItem, { marginTop: '8%' }]}>
          <Image resizeMode='contain' style={styles.menuIcon} source={require('../../assets/icons/Drawer/history.png')} />
          <Text style={styles.menuText}>Order History</Text>
          <Image resizeMode='contain' style={styles.menuIconforward} source={require('../../assets/icons/Drawer/forward.png')} />
        </TouchableOpacity>


      



        <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, { marginTop: '20%' }]}>
          <Image resizeMode='contain' style={styles.menuIcon} source={require('../../assets/icons/Drawer/out.png')} />
          <Text style={styles.menuText}>Log Out</Text>
          <Image resizeMode='contain' style={styles.menuIconforward} source={require('../../assets/icons/Drawer/forward.png')} />
        </TouchableOpacity>



      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    height: 121,
    backgroundColor: '#6C53FD',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    marginLeft: '5%',
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  profileTextContainer: {
    marginLeft: '4%',
  },
  profileName: {
    fontSize: 16,
    color: themeStyle.WHITE,
    fontFamily: FONT.ManropeSemiBold,
    width: '100%',
  },
  profileEmail: {
    fontSize: 12,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeSemiBold,
  },
  menu: {
    marginTop: '5%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  menuIcon: {
    height: 19,
    width: 19,
    marginLeft: '10%',   
  },
  menuText: {
    fontSize: 16,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeMedium,
    marginLeft: '5%',
  }, menuIconforward: {
    height: 10,
    width: 6,
    marginLeft: 'auto',
    marginRight: '10%'
  }
})
