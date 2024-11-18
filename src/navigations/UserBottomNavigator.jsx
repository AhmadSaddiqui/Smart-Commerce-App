import { StyleSheet, View, Image, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SupplierHome from '../supplierScreens/SupplierHome';
import themeStyle, { FONT } from '../styles/themeStyle';
import SupplierProducts from '../supplierScreens/SupplierProducts';
import SupplierOrderManagement from '../supplierScreens/SupplierOrderManagement';
import SupplierSetting from '../supplierScreens/SupplierSetting';
import SupplierEditProfile from '../supplierScreens/SupplierEditProfile';
import UserHome from '../userScreens/UserHome';
import UserMyOrders from '../userScreens/UserMyOrders';
import UserCart from '../userScreens/UserCart';
import UserFavourites from '../userScreens/UserFavourites';
import Profile from '../userScreens/Profile';
import EditProfile from '../userScreens/EditProfile';
import UserProducts from '../userScreens/UserProducts';


const Tab = createBottomTabNavigator();
const UserBottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { display: 'none' },
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          borderTopColor: 'transparent',
          height: 50,
        },
      }}>
      <Tab.Screen
        name={'Home'}
        component={UserHome}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                resizeMode='contain'
                source={require('../../assets/icons/BottomNavigator/home.png')}
                style={styles.tabBarIcon}
                tintColor={focused ? themeStyle.PRIMARY_COLOR : themeStyle.GREY}
              />
              <Text
                style={[
                  styles.title,
                  {
                    color: focused ? themeStyle.PRIMARY_COLOR : themeStyle.TEXT_GREY,
                    fontFamily: focused
                      ? FONT.Montserrat_SemiBold
                      : FONT.Montserrat_Regular,

                  },
                ]}>
                Home
              </Text>
            </View>
          ),
        }}
      />


      <Tab.Screen
        name={'Orders'}
        component={UserMyOrders}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                resizeMode='contain'

                source={require('../../assets/icons/BottomNavigator/order.png')}

                style={styles.tabBarIcon}
                tintColor={focused ? themeStyle.PRIMARY_COLOR : themeStyle.GREY}
              />
              <Text
                style={[
                  styles.title,
                  {
                    color: focused ? themeStyle.PRIMARY_COLOR : themeStyle.TEXT_GREY,
                    fontFamily: focused
                      ? FONT.Montserrat_SemiBold
                      : FONT.Montserrat_Regular,

                  },
                ]}>
                Orders
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'Cart'}
        component={UserCart}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                resizeMode='contain'

                source={require('../../assets/images/Home/usercart.png')}

                style={[styles.tabBarIcon,{right:2}]}
                tintColor={focused ? themeStyle.PRIMARY_COLOR : themeStyle.GREY}
              />
              <Text
                style={[
                  styles.title,
                  {
                    color: focused ? themeStyle.PRIMARY_COLOR : themeStyle.TEXT_GREY,
                    fontFamily: focused
                      ? FONT.Montserrat_SemiBold
                      : FONT.Montserrat_Regular,
                  },
                ]}>
          Cart
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'Favourites'}
        component={UserFavourites}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                resizeMode='contain'

                source={require('../../assets/images/Home/userheart.png')}


                style={{ height: 19, width: 19 }}
                tintColor={focused ? themeStyle.PRIMARY_COLOR : themeStyle.GREY}
              />
              <Text
                style={[
                  styles.title,
                  {
                    color: focused ? themeStyle.PRIMARY_COLOR : themeStyle.TEXT_GREY,
                    fontFamily: focused
                      ? FONT.Montserrat_SemiBold
                      : FONT.Montserrat_Regular,
                  },
                ]}>
                Favourites
              </Text>
            </View>
          ),
        }}
        />

<Tab.Screen
        name={'Profile'}
        component={EditProfile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                resizeMode='contain'
                source={require('../../assets/icons/BottomNavigator/user.png')}
                style={{ height: 19, width: 19 }}
                tintColor={focused ? themeStyle.PRIMARY_COLOR : themeStyle.GREY}
              />
              <Text
                style={[
                  styles.title,
                  {
                    color: focused ? themeStyle.PRIMARY_COLOR : themeStyle.TEXT_GREY,
                    fontFamily: focused
                      ? FONT.Montserrat_SemiBold
                      : FONT.Montserrat_Regular,
                  },
                ]}>
                Profile
              </Text>
            </View>
          ),
        }}
      />


    </Tab.Navigator>
  );
};

export default UserBottomNavigation;

const styles = StyleSheet.create({
  tabBarIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIcon: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
  },
  tabBarHomeIcon: {
    height: 23,
    width: 23,
    resizeMode: 'contain',
  },
  activeTabBar: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#014568',
  },
  title: {
    marginTop: '3%',
    fontSize: 9,
    fontFamily: FONT.Poppins_Regular,
  },
});
