import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UserDrawer from '../userScreens/UserDrawer';
import UserHome from '../userScreens/UserHome';
import UserCart from '../userScreens/UserCart';
import UserFavourites from '../userScreens/UserFavourites';
import UserMyOrders from '../userScreens/UserMyOrders';
import BulkOrder from '../userScreens/BulkOrder';
import Address from '../userScreens/Address';
import UserBottomNavigation from './UserBottomNavigator';

const Drawer = createDrawerNavigator();

const AppDrawer = ({ navigation }) => {

  return (
    <Drawer.Navigator initialRouteName="Home"
      screenOptions={{ headerShown: false }} drawerContent={(props) => <UserDrawer {...props} />} >
      <Drawer.Screen name="Home" component={UserBottomNavigation} />
      <Drawer.Screen name="UserCart" component={UserCart} />
      <Drawer.Screen name="UserFavourites" component={UserFavourites} />
      <Drawer.Screen name="UserMyOrders" component={UserMyOrders} />
      <Drawer.Screen name="BulkOrder" component={BulkOrder} />
      {/* <Drawer.Screen name="Address" component={Address} /> */}

    </Drawer.Navigator>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppDrawer;
