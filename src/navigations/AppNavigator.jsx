import { StyleSheet } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ROUTES } from '../routes/RoutesConstants';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import UserSignin from '../userScreens/UserSignin';
import UserSignup from '../userScreens/UserSignup';
import UserResetpassword from '../userScreens/UserResetpassword';
import UserCreateNewPassword from '../userScreens/UserCreateNewPassword';
import AppDrawer from './DrawerNavigation';
import UserSingleItem from '../userScreens/UserSingleItem';
import UserCheckout from '../userScreens/UserCheckout';
import UserPaymentDetails from '../userScreens/UserPaymentDetails';
import UserPaymentDetailsConfirm from '../userScreens/UserPaymentDetailsConfirm';
import UserOtp from '../userScreens/UserOtp';
import SupplierSignin from '../supplierScreens/SupplierSignin';
import SupplierSignup from '../supplierScreens/SupplierSignup';
import SupplierOtp from '../supplierScreens/SupplierOtp';
import SupplierResetpassword from '../supplierScreens/SupplierResetpassword';
import SupplierCreateNewPassword from '../supplierScreens/SupplierCreateNewPassword';
import BottomNavigation from './BottomNavigator';
import AddProduct from '../supplierScreens/AddProduct';
import EditProduct from '../supplierScreens/EditProduct';
import EditProfile from '../userScreens/EditProfile';
import Profile from '../userScreens/Profile';
import EditAddress from '../userScreens/EditAddress';
import OrderUpdates from '../supplierScreens/OrderUpdates';
import SupplierEditProfile from '../supplierScreens/SupplierEditProfile';
import AddCategory from '../supplierScreens/AddCategory';
import AddSubCategory from '../supplierScreens/AddSubCategory';
import Promotions from '../supplierScreens/Promotions';
import ProductAlerts from '../supplierScreens/ProductAlerts';
import ChooseLanguage from '../supplierScreens/ChooseLanguage';
import SupplierChangePassword from '../supplierScreens/SupplierChangePassword';
import PrivacyPolicy from '../userScreens/PrivacyPolicy';
import AllProducts from '../userScreens/AllProducts';
import UserBottomNavigation from './UserBottomNavigator';
import UserProducts from '../userScreens/UserProducts';
import ConfirmOtp from '../userScreens/ConfirmOtp';
import PaymentScreen from '../userScreens/PaymentScreen';
import SupplierConfirmOtp from '../supplierScreens/SupplierConfirmOtp';
import Shipping from '../userScreens/Shipping';

const AppNavigator = () => {

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.screenSplash} component={Splash} />
        <Stack.Screen name={ROUTES.Onboarding} component={Onboarding} />
        <Stack.Screen name={ROUTES.UserSignin} component={UserSignin} />
        <Stack.Screen name={ROUTES.UserSignup} component={UserSignup} />
        <Stack.Screen name={ROUTES.UserOtp} component={UserOtp} />
        <Stack.Screen name={ROUTES.UserResetpassword} component={UserResetpassword} />
        <Stack.Screen name={ROUTES.UserCreateNewPassword} component={UserCreateNewPassword} />
        <Stack.Screen name={ROUTES.AppDrawer} component={AppDrawer} />
        <Stack.Screen name={ROUTES.UserBottomNavigation} component={UserBottomNavigation} />
        <Stack.Screen name={ROUTES.UserSingleItem} component={UserSingleItem} />
        <Stack.Screen name={ROUTES.UserCheckout} component={UserCheckout} />
        <Stack.Screen name={ROUTES.UserPaymentDetails} component={UserPaymentDetails} />
        <Stack.Screen name={ROUTES.UserPaymentDetailsConfirm} component={UserPaymentDetailsConfirm} />
        <Stack.Screen name={ROUTES.SupplierSignin} component={SupplierSignin} />
        <Stack.Screen name={ROUTES.SupplierSignup} component={SupplierSignup} />
        <Stack.Screen name={ROUTES.SupplierOtp} component={SupplierOtp} />
        <Stack.Screen name={ROUTES.SupplierResetpassword} component={SupplierResetpassword} />
        <Stack.Screen name={ROUTES.SupplierCreateNewPassword} component={SupplierCreateNewPassword} />
        <Stack.Screen name={ROUTES.SupplierHome} component={BottomNavigation} />
        <Stack.Screen name={ROUTES.AddProduct} component={AddProduct} />
        <Stack.Screen name={ROUTES.AddCategory} component={AddCategory} />
        <Stack.Screen name={ROUTES.EditProduct} component={EditProduct} />
        <Stack.Screen name={ROUTES.EditProfile} component={EditProfile} />
        <Stack.Screen name={ROUTES.Profile} component={Profile} />
        <Stack.Screen name={ROUTES.EditAddress} component={EditAddress} />
        <Stack.Screen name={ROUTES.OrderUpdates} component={OrderUpdates} />
        <Stack.Screen name={ROUTES.SupplierEditProfile} component={SupplierEditProfile} />
        <Stack.Screen name={ROUTES.AddSubCategory} component={AddSubCategory} />
        <Stack.Screen name={ROUTES.Promotions} component={Promotions} />
        <Stack.Screen name={ROUTES.ProductAlerts} component={ProductAlerts} />
        <Stack.Screen name={ROUTES.ChooseLanguage} component={ChooseLanguage} />
        <Stack.Screen name={ROUTES.SupplierChangePassword} component={SupplierChangePassword} />
        <Stack.Screen name={ROUTES.PrivacyPolicy} component={PrivacyPolicy} />
        <Stack.Screen name={ROUTES.AllProducts} component={AllProducts} />
        <Stack.Screen name={ROUTES.UserProducts} component={UserProducts} />
        <Stack.Screen name={ROUTES.ConfirmOtp} component={ConfirmOtp} />
        <Stack.Screen name={ROUTES.PaymentScreen} component={PaymentScreen} />
        <Stack.Screen name={ROUTES.SupplierConfirmOtp} component={SupplierConfirmOtp} />
        <Stack.Screen name={ROUTES.Shipping} component={Shipping} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})
