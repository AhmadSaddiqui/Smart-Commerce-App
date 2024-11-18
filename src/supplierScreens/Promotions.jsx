// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// export default function Promotions({ navigation }) {
//   const promotionsData = [
//     { id: '1', title: '10% Off on Your Next Order', description: 'Use code NEXT10 at checkout.', expirationDate: '30 Sep, 2024' },
//     { id: '2', title: 'Free Delivery on Orders Over $50', description: 'No code needed. Just shop over $50.', expirationDate: '15 Oct, 2024' },
//     { id: '3', title: 'Buy 1 Get 1 Free on Select Items', description: 'Buy one, get one free on select items.', expirationDate: '01 Nov, 2024' },
//     { id: '4', title: '20% Off on First Purchase', description: 'Sign up to get 20% off your first purchase.', expirationDate: '31 Dec, 2024' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Image resizeMode='contain' style={{ height: 20, width: 30 }} source={require('../../assets/images/Cart/back.png')} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Promotions</Text>
//       </View>
//       <ScrollView style={styles.scrollView}>
//         {promotionsData.map((promo) => (
//           <View key={promo.id} style={styles.promoCard}>
//             <View style={styles.promoHeader}>
//               <Text style={styles.promoTitle}>{promo.title}</Text>
//             </View>
//             <Text style={styles.promoDescription}>{promo.description}</Text>
//             <Text style={styles.expirationDate}>Expires on: {promo.expirationDate}</Text>
//             {/* <TouchableOpacity style={styles.viewDetailButton}>
//               <Text style={styles.viewDetailText}>View Details</Text>
//             </TouchableOpacity> */}
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '23%',
    color: 'black',
  },
  scrollView: {
    flex: 1,
  },
  promoCard: {
    backgroundColor: 'rgba(223, 223, 223, 0.08)',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.2,
  },
  promoHeader: {
    marginBottom: 8,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
  },
  promoDescription: {
    color: '#757575',
    fontSize: 14,
    marginBottom: 8,
  },
  expirationDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 16,
  },
  viewDetailButton: {
    borderWidth: 1,
    borderColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewDetailText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomSwitch from '../components/CustomSwitch';
import themeStyle, { FONT } from '../styles/themeStyle';
import GlobalButton from '../components/GlobalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { BaseurlSupplier } from '../Apis/apiConfig';

export default function Promotions({ navigation }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isSwitchOn1, setIsSwitchOn1] = useState(false);
  const [isSwitchOn2, setIsSwitchOn2] = useState(false);

  const [flatrate, setFlatrate] = useState('');
  const [byweight, setByweight] = useState('');
  const [byDistance, setByDistance] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSupplier = async () => {
      try {
        const supplierId = await AsyncStorage.getItem('supplierId');
        const token = await AsyncStorage.getItem('supplierToken');
        const headers = {
          "Content-Type": "application/json",
          "x-access-token": token,
        };
        const response = await fetch(`${BaseurlSupplier}/${supplierId}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);

        // Set the states for each delivery option
        setFlatrate(data?.deliveryOption?.flateRate || ''); // Handle undefined case with fallback
        setByweight(data?.deliveryOption?.byWeight || '');
        setByDistance(data?.deliveryOption?.byDistance || '');
        console.log("data deliveryOption", data?.deliveryOption?.flateRate, data.deliveryOption);
        // Check which option is selected and set the corresponding switch
        if (data?.selectedDeliveryOption === 'flateRate') {
          setIsSwitchOn(true);
        }
        if (data?.selectedDeliveryOption === 'byWeight') {
          setIsSwitchOn1(true);
        }
        if (data?.selectedDeliveryOption === 'byDistance') {
          setIsSwitchOn2(true);
        }

      } catch (error) {
        console.error('Error fetching supplier data:', error);
      }
    };

    getSupplier();
  }, []); // Empty dependency array to run once on component mount


  const handleToggle = () => {
    if (!isSwitchOn) {
      setIsSwitchOn(true);
      setIsSwitchOn1(false);
      setIsSwitchOn2(false);
    } else {
      setIsSwitchOn(false);
    }
  };

  const handleToggle1 = () => {
    if (!isSwitchOn1) {
      setIsSwitchOn(false);
      setIsSwitchOn1(true);
      setIsSwitchOn2(false);
    } else {
      setIsSwitchOn1(false);
    }
  };

  const handleToggle2 = () => {
    if (!isSwitchOn2) {
      setIsSwitchOn(false);
      setIsSwitchOn1(false);
      setIsSwitchOn2(true);
    } else {
      setIsSwitchOn2(false);
    }
  };

  const deliveryOption = isSwitchOn == true ? 'flatRate' : isSwitchOn1 == true ? 'byWeight' : isSwitchOn2 == true ? 'byDistance' : null
  console.log(deliveryOption)
  useEffect(() => {
    console.log(isSwitchOn, 'isSwitchOn')
    console.log(isSwitchOn1, 'isSwitchOn1')
    console.log(isSwitchOn2, 'isSwitchOn2')

  }, [isSwitchOn, isSwitchOn1, isSwitchOn2])

  const handleSave = async () => {
    // Ensure only one switch is on
    const activeSwitches = [isSwitchOn, isSwitchOn1, isSwitchOn2].filter(switchState => switchState === true);
    if (activeSwitches.length > 1) {
      Snackbar.show({
        text: 'Please select only one delivery option.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }

    const supplierId = await AsyncStorage.getItem('supplierId');
    const token = await AsyncStorage.getItem('supplierToken');
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    const raw = JSON.stringify({
      flateRate: flatrate ? parseFloat(flatrate) : 0,
      byWeight: byweight ? parseFloat(byweight) : 0,
      byDistance: byDistance ? parseFloat(byDistance) : 0
    });

    const requestOptions = {
      method: "PUT",
      headers: headers,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/supplier/delivery-option/${supplierId}`, requestOptions);
      const result = await response.json();

      Snackbar.show({
        text: result?.message || 'Settings saved successfully',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: themeStyle.PRIMARY_COLOR,
        textColor: 'white',
        marginBottom: 0,
      });
      await changeDeliveryOption()
    } catch (error) {
      console.error(error);
      Snackbar.show({
        text: 'An error occurred. Please try again later.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const changeDeliveryOption = async () => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    const token = await AsyncStorage.getItem('supplierToken');
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    const raw = JSON.stringify({
      supplierId: supplierId,
      selectedDeliveryOption: deliveryOption
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/supplier/change-selected-delivery-option", requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Assuming the API returns a JSON response
      console.log(result, '---------');
    } catch (error) {
      console.error('Error in changing delivery option:', error);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: themeStyle.WHITE }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image resizeMode='contain' style={{ height: 20, width: 30 }} source={require('../../assets/images/Cart/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Options</Text>
      </View>

      <Text style={{ fontSize: 14, color: themeStyle.BLACK, marginLeft: '5%', fontFamily: FONT.ManropeSemiBold, marginTop: '5%' }}>Delivery Option</Text>

      <View style={{ alignItems: "center", marginTop: "5%", width: '100%' }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: '90%', alignSelf: 'center' }}>
          <Text style={{ fontSize: 12, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeRegular }}>Flat Rate:</Text>
          <CustomSwitch isOn={isSwitchOn} onToggle={handleToggle} />
        </View>
        <View style={{ backgroundColor: themeStyle.WHITE, elevation: .5, alignItems: 'center', justifyContent: "center", borderRadius: 5, height: 45, borderColor: themeStyle.PRIMARY_COLOR, borderWidth: 1, width: '90%', alignSelf: 'center', marginTop: 16 }}>
          <TextInput
            keyboardType='numeric'
            onChangeText={setFlatrate}
            value={flatrate?.toString()} // Ensure the value is a string and valid
            placeholderTextColor={themeStyle.TEXT_GREY}
            placeholder='$10'
            style={{ fontSize: 12, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeRegular, width: '100%', paddingHorizontal: 10 }}
          />
        </View>

      </View>

      <View style={{ alignItems: "center", marginTop: "5%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: '90%', alignSelf: 'center' }}>
          <Text style={{ fontSize: 12, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeRegular }}>By Weight:</Text>
          <CustomSwitch isOn={isSwitchOn1} onToggle={handleToggle1} />
        </View>
        <View style={{ backgroundColor: themeStyle.WHITE, elevation: .5, alignItems: 'center', justifyContent: "center", borderRadius: 5, height: 45, borderColor: themeStyle.PRIMARY_COLOR, borderWidth: 1, width: '90%', alignSelf: 'center', marginTop: 16 }}>
          <TextInput
            keyboardType='numeric'
            onChangeText={setByweight}
            value={byweight?.toString()} // Ensure the value is a string and valid
            placeholderTextColor={themeStyle.TEXT_GREY}
            placeholder='$0.60  5 cents / Kg'
            style={{ fontSize: 12, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeRegular, width: '100%', paddingHorizontal: 10 }}
          />
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: "5%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: '90%', alignSelf: 'center' }}>
          <Text style={{ fontSize: 12, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeRegular }}>By Distance:</Text>
          <CustomSwitch isOn={isSwitchOn2} onToggle={handleToggle2} />
        </View>
        <View style={{ backgroundColor: themeStyle.WHITE, elevation: .5, alignItems: 'center', justifyContent: "center", borderRadius: 5, height: 45, borderColor: themeStyle.PRIMARY_COLOR, borderWidth: 1, width: '90%', alignSelf: 'center', marginTop: 16 }}>
          <TextInput
            keyboardType='numeric'
            onChangeText={setByDistance}
            value={byDistance.toString()} // Ensure that the value prop is passed
            placeholderTextColor={themeStyle.TEXT_GREY}
            placeholder='$0.30  10 Cents / km'
            style={{ fontSize: 12, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeRegular, width: '100%', paddingHorizontal: 10 }}
          />
        </View>
      </View>

      <GlobalButton marginTop={'10%'} title={'Save'} onPress={handleSave} loading={loading} />
    </View>
  )
}
