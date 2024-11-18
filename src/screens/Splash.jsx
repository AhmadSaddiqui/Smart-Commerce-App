import { View, ImageBackground, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../routes/RoutesConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash() {

  const navigation = useNavigation()
  const getID = async () => {
    try {
      const restuarantId = await AsyncStorage.getItem('restuarantId');
      const supplierId = await AsyncStorage.getItem('supplierId');
      console.log(restuarantId, 'restuarantId');
      console.log(supplierId, 'supplierId');
  
      if (restuarantId && !supplierId) {
        navigation.replace(ROUTES.AppDrawer);
      } else if (restuarantId && supplierId) {
        navigation.replace(ROUTES.SupplierHome);
      } else {
        navigation.replace(ROUTES.Onboarding);
      }
    } catch (error) {
      console.error('Error fetching IDs from AsyncStorage', error);
    }
  };
  
  useEffect(() => {
    setTimeout(getID, 2000); // Retain the delay here if necessary
  }, []);


  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={require('../../assets/images/Splash/imagebg.png')}
        resizeMode="cover"
      >
        <Image style={styles.logo} source={require('../../assets/images/Splash/logo.png')} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 156,
    width: 276,
  },
});
