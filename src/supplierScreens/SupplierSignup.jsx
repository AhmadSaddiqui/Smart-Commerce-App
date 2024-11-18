import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import themeStyle, { FONT } from '../styles/themeStyle';
import GlobalInput from '../components/GlobalInput';
import PasswordInput from '../components/PasswordInput';
import GlobalButton from '../components/GlobalButton';
import Snackbar from 'react-native-snackbar';
import { ROUTES } from '../routes/RoutesConstants';
import { BaseurlSupplier } from '../Apis/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton';

export default function SupplierSignup({ navigation }) {
  // State hooks for input fields
  const [supplierName, setSupplierName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [tick, setTick] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggletick = () => {
    setTick(!tick);
  };

  const registerSupplier = async () => {
    if (!supplierName || !phoneNumber || !email || !billingAddress || !password) {
      Snackbar.show({
        text: 'Please Enter All Fields',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    } else if (password !== repeatPassword) {
      Snackbar.show({
        text: 'Passwords do not match',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    } else if (!tick) {
      Snackbar.show({
        text: 'Please Agree to terms',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }

    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "name": supplierName,
      "email": email,
      "phone": phoneNumber,
      "contactPerson": contactPerson,
      "password": password,
      "address": billingAddress,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch(`${BaseurlSupplier}`, requestOptions);
      const result = await response.json();

      console.log(result);
      if (result?.message.includes('successfully') ) {
        // await AsyncStorage.setItem('supplierToken',result?.token)
        // await AsyncStorage.setItem('supplierId',result?.supplier?.id)
        Snackbar.show({
          text: result?.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)',
          textColor: 'white',
          marginBottom: 0,
        });
        navigation.replace(ROUTES.SupplierConfirmOtp, {email:email});
      } else {
        Snackbar.show({
          text: result?.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)',
          textColor: 'white',
          marginBottom: 0,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while creating the supplier");
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[themeStyle.backgroundFirst, themeStyle.backgroundSecond]} style={styles.container}>


    <View style={styles.container}>
      <ScrollView>
        <BackButton/>
        <Header title={'Register!'} description={'Please Register to continue.'} />

        <GlobalInput
          value={supplierName}
          onChangeText={setSupplierName}
          title={'Supplier Name'}
          hint={'Supplier Name'}
          marginTop={'5%'}
        />
        <GlobalInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          title={'Phone Number'}
          hint={'Enter your Phone Number'}
          marginTop={'5%'}
          keyboardType={'numeric'}
        />
        <GlobalInput
          value={email}
          onChangeText={setEmail}
          title={'Email Address'}
          hint={'Enter your email address'}
          marginTop={'5%'}
        />
        {/* <GlobalInput
          value={contactPerson}
          onChangeText={setContactPerson}
          title={'Contact Name'}
          hint={'Name'}
          marginTop={'5%'}
        /> */}
        <GlobalInput
          value={billingAddress}
          onChangeText={setBillingAddress}
          title={'Address'}
          hint={'Address'}
          marginTop={'5%'}
        />
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          hint={'Create Password'}
          title={'Create Password'}
        />
        <PasswordInput
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          hint={'Repeat Password'}
          title={'Repeat Password'}
        />
        <View style={styles.rememberContainer}>
          <TouchableOpacity onPress={toggletick} style={styles.rememberButton}>
            <View style={[styles.tickBox, { backgroundColor: tick ? themeStyle.PRIMARY_COLOR : themeStyle.WHITE, borderWidth: tick ? 0 : 1 }]}>
              {tick && <Image style={styles.tickImage} source={require('../../assets/images/OnBoarding/tick.png')} />}
            </View>
            <Text style={styles.rememberText}>I agree to all terms & conditions and privacy policy.</Text>
          </TouchableOpacity>
        </View>
        <GlobalButton
          loading={loading}
          title={'Register'}
          marginTop={'8%'}
          onPress={registerSupplier}
        />
        <View style={styles.separator} />
      </ScrollView>
    </View>
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: themeStyle.PRIMARY_LIGHT,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '6%',
  },
  rememberButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickBox: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  tickImage: {
    height: 7,
    width: 10,
  },
  rememberText: {
    fontSize: 15,
    color: themeStyle.MEDIUM_BLACK,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '2%',
    width: '92%',
  },
  separator: {
    height: 20,
  },
});
