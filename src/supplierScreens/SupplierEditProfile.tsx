import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, Alert } from 'react-native';
import themeStyle from '../styles/themeStyle';
import { ROUTES } from '../routes/RoutesConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import GlobalButton from '../components/GlobalButton';
import { useNavigation } from '@react-navigation/native';
import GlobalInput from '../components/GlobalInput';

const SupplierEditProfile = () => {
  const navigation = useNavigation()
  // Define state for the input fields
  const [supplierName, setSupplierName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [data, setdata] = useState(null)
  const [phone, setPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [loading, setloading] = useState(false)

  const handleLogout = async () => {
    await AsyncStorage.removeItem('supplierId');
    navigation.replace(ROUTES.Onboarding);
  };

  const fetchSupplierData = async () => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    const token = await AsyncStorage.getItem('supplierToken');
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };
    const requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow',
    };

    try {
      const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/supplier/${supplierId}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // or response.text() if the API returns plain text
      console.log('data:', result);
      setdata(result)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSupplierData();

  }, []);


  useEffect(() => {
    if (data) {
      setSupplierName(data?.name)
      setEmail(data?.email)
      setPhone(data?.phone)
      setBillingAddress(data?.billingAddress)
    }

  }, [data]);


  const handleSaveProfile = async () => {
    setloading(true)
    const token = await AsyncStorage.getItem('supplierToken');
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };

    const supplierId = await AsyncStorage.getItem('supplierId');
    const raw = JSON.stringify({
      name: supplierName,
      email: email,
      phone: phone,
      id: supplierId

    });

    const requestOptions = {
      method: "PUT",
      headers: headers,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/supplier", requestOptions);
      const result = await response.json();
      setloading(false)
      navigation.navigate(ROUTES.SupplierHome)

      if (response.ok) {
        Snackbar.show({
          text: 'Profile updated successfully.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)',
          textColor: 'white',
          marginBottom: 0,
        });
      } else {
        Snackbar.show({
          text: 'Failed to update profile.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)',
          textColor: 'white',
          marginBottom: 0,
        });
      }
      console.log(result);
    } catch (error) {
      setloading(false)
      console.error(error);
      Snackbar.show({
        text: 'Failed to update profile.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', marginVertical: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image resizeMode='contain' style={{
                width: 30, height: 20, tintColor: themeStyle.WHITE
              }} source={require('../../assets/images/Cart/back.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <Image style={{ width: 80, height: 80, alignSelf: 'center', borderRadius: 40 }} source={require('../../assets/images/Splash/dp.png')} />
          <Text style={styles.userText}>{data?.name}</Text>
          <Text style={styles.userText}>{data?.email}</Text>
        </View>

        <GlobalInput
          value={supplierName}
          onChangeText={setSupplierName}
          title={'Supplier Name'}
          hint={'Enter Supplier Name'}
          marginTop={'5%'}
        />
        {/* <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Supplier Name</Text>
          <TextInput
            style={styles.infoText}
            value={supplierName}
            onChangeText={setSupplierName}
            placeholder="Enter Supplier Name"
          />
        </View> */}

        {/* <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Business Name</Text>
          <TextInput
            style={styles.infoText}
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter Business Name"
          />
        </View> */}

        <GlobalInput
          value={email}
          onChangeText={setEmail}
          title={'Email Address'}
          hint={'Enter Email Address'}
          marginTop={'5%'}
          keyboardType={'email-address'}
        />
        {/* <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Email Address</Text>
          <TextInput
            style={styles.infoText}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email Address"
            keyboardType="email-address"
          />
        </View> */}

        <GlobalInput
          value={phone}
          onChangeText={setPhone}
          title={'Phone Number'}
          hint={'Enter Phone Number'}
          marginTop={'5%'}
          keyboardType={'numeric'}
        />

        {/* <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Phone Number</Text>
          <TextInput
            style={styles.infoText}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter Phone Number"
            keyboardType="numeric"
          />
        </View> */}
        <GlobalInput
          value={billingAddress}
          onChangeText={setBillingAddress}
          title={'Billing Address'}
          hint={'Billing Address'}
          marginTop={'5%'}
        />
        {/* <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Billing Address</Text>
          <TextInput
            style={styles.infoText}
            value={billingAddress}
            onChangeText={setBillingAddress}
            placeholder="Billing Address"
          // keyboardType="numeric"
          />
        </View> */}
        {/* <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Business Address</Text>
          <TextInput
            style={styles.infoText}
            value={businessAddress}
            onChangeText={setBusinessAddress}
            placeholder="Enter Business Address"
          />
        </View> */}

        <GlobalButton loading={loading} marginTop={40} onPress={handleSaveProfile} title={'Update'} />
        {/* <GlobalButton marginTop={20} onPress={handleLogout} title={'Log Out'} /> */}





      </ScrollView>
    </SafeAreaView>
  );
};


export default SupplierEditProfile
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
    // padding: 20,
    width: '100%',
  },
  header: {
    // flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: themeStyle.PRIMARY_COLOR,
    height: 220,
    // marginBottom: 30,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '28%',
    color: themeStyle.WHITE,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFD1BA',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FF4B4B',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: 'black',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: 'black',
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 1)",
    elevation: 1,
    borderRadius: 15,
    marginTop: 5,


  },
  saveButton: {
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})