import { View, ImageBackground, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../routes/RoutesConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash() {

  const navigation = useNavigation();

  const getID = async () => {
    try {
      const buyerId = await AsyncStorage.getItem('buyerId');
      const supplierId = await AsyncStorage.getItem('supplierId');
      console.log(supplierId, 'supplierId');
  
      if (buyerId && !supplierId) {
        navigation.replace(ROUTES.AppDrawer);
      } else if (buyerId && supplierId) {
        navigation.replace(ROUTES.SupplierHome);
      } else {
        navigation.replace(ROUTES.UserSignin);
        // navigation.replace(ROUTES.AppDrawer);

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
        resizeMode="cover"
      >
        <Image
          source={require('../../assets/images/Splash/c.png')}
          style={styles.image}
        />
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
  image: {
    width: 300,
    height: 300,
  },
});
