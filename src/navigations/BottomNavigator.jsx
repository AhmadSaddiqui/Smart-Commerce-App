import { StyleSheet, View, Image, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SupplierHome from '../supplierScreens/SupplierHome';
import themeStyle, { FONT } from '../styles/themeStyle';
import SupplierProducts from '../supplierScreens/SupplierProducts';
import SupplierOrderManagement from '../supplierScreens/SupplierOrderManagement';
import SupplierSetting from '../supplierScreens/SupplierSetting';
import SupplierEditProfile from '../supplierScreens/SupplierEditProfile';
import AddSubCategory from '../supplierScreens/AddSubCategory';


const Tab = createBottomTabNavigator();
const BottomNavigation = () => {
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
        component={SupplierHome}
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
        name={'Products'}
        component={SupplierProducts}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                resizeMode='contain'

                source={require('../../assets/icons/BottomNavigator/product.png')}

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
                Products
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'Orders'}
        component={SupplierOrderManagement}
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
        name={'Settings'}
        component={AddSubCategory}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIconContainer}>
              <Image
                resizeMode='contain'

                source={require('../../assets/icons/BottomNavigator/setting.png')}

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
                Sub category
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'Profile'}
        component={SupplierSetting}
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
                Settings
              </Text>
            </View>
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default BottomNavigation;

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
