import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import themeStyle, { FONT } from '../styles/themeStyle';
import GlobalInput from '../components/GlobalInput';
import PasswordInput from '../components/PasswordInput';
import GlobalButton from '../components/GlobalButton';
import NoteInput from '../components/NoteInput';
import { Baseurl, BaseurlRestuarant } from '../Apis/apiConfig';
import { ROUTES } from '../routes/RoutesConstants';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from 'react-native-phone-input';
import { isValidNumber } from "react-native-phone-number-input";
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton';



export default function UserSignup({navigation}) {
  // State hooks for input fields
  const [restaurantName, setRestaurantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [numberError, setNumberError] = useState('');
  const [userNumber, setUserNumber] = useState('');
  const [tick, setTick] = useState(true);
const [loading, setloading] = useState(false)
  console.log(phoneNumber,restaurantName)
  const toggletick = () => {
    setTick(!tick);
  };

  const handlePhoneNumberChange = (num) => {
    setPhoneNumber(num);
    setNumberError('');
    validateNumber(num);
  };

  const validateNumber = (num) => {
    const isNum = isValidNumber(num);
    setNumberError(isNum ? '' : 'Invalid mobile number');
  };


  const createUser = async () => {
    console.log(restaurantName, phoneNumber, email, shippingAddress, password, '----');
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/; // Adjust according to your phone number format requirements
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!restaurantName || !phoneNumber || !email  || !shippingAddress  || !password) {
      Snackbar.show({
        text: 'Please Enter All Fields',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }
  
    if (!emailRegex.test(email)) {
      Snackbar.show({
        text: 'Please enter a valid email address',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }
  
    if (numberError) {
      Snackbar.show({
        text: 'Please enter a valid phone number',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }
  
    if (!passwordRegex.test(password)) {
      Snackbar.show({
        text: 'Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }
  
    if (password !== repeatPassword) {
      Snackbar.show({
        text: 'Passwords do not match',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }
  
    if (!tick) {
      Snackbar.show({
        text: 'Please Agree to terms',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }
  
    setloading(true);
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      "phone": phoneNumber,
      "email": email,
      "billingAddress": billingAddress,
      "shippingAddress": shippingAddress,
      "name": restaurantName,
      "specialNote": specialNote,
      "password": password
    });
  
    console.log(raw);
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    try {
      const response = await fetch(`${BaseurlRestuarant}`, requestOptions);
      const result = await response.json();
      console.log(result);
  
      Snackbar.show({
        text: result?.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
  
      if (result?.success == true) {
        navigation.replace(ROUTES.ConfirmOtp,{email:email});
        
      }
  
      setloading(false);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while creating the user");
      setloading(false);
    }
  };
  
  return (
    <LinearGradient colors={[themeStyle.backgroundFirst, themeStyle.backgroundSecond]} style={styles.container}>
    <View style={styles.container}>
      <ScrollView>
        <BackButton/>
        <Header title={'Register!'} description={'Please Register to continue.'} />

        <GlobalInput
          value={restaurantName}
          onChangeText={(text)=>setRestaurantName(text)}
          title={'Restaurant Name'}
          hint={'Restaurant Name'}
          marginTop={'5%'}
        />
        {/* <GlobalInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          title={'Phone Number'}
          hint={'Enter your Phone Number'}
          marginTop={'5%'}
          keyboardType={'numeric'}
        /> */}
          <View style={[styles.container2]}>
      <Text style={styles.label2}>Phone Number</Text>
      <PhoneInput
            style={styles.input}
            initialCountry={"Pk"}
            initialValue={"92"}
            onChangePhoneNumber={handlePhoneNumberChange}
            textProps={{
              color: themeStyle.BLACK,
              placeholder: "Enter Phone ...",
            }}
          />
    </View>
    {numberError !== '' && <Text style={styles.errorText}>{numberError}</Text>}
        <GlobalInput
          value={email}
          onChangeText={setEmail}
          title={'Email Address'}
          hint={'Enter your email address'}
          marginTop={'5%'}
        />
        {/* <GlobalInput
          value={billingAddress}
          onChangeText={setBillingAddress}
          title={'Billing Address'}
          hint={'Address'}
          marginTop={'5%'}
        /> */}
        <GlobalInput
          value={shippingAddress}
          onChangeText={setShippingAddress}
          title={'Shipping Address'}
          hint={'Address'}
          marginTop={'5%'}
        />
        {/* <GlobalInput
          value={contactPerson}
          onChangeText={setContactPerson}
          title={'Contact Person'}
          hint={'Name'}
          marginTop={'5%'}
        /> */}
        {/* <NoteInput
          value={specialNote}
        onChangeText={(text)=>setSpecialNote(text)}
          title={'Special Note'}
          hint={'Write Here'}
          marginTop={'5%'}
        /> */}
        <PasswordInput
          value={password}
          onChangeText={(text)=>setPassword(text)}
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
          onPress={createUser}
        />
        <View style={styles.separator}/>
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
    width:'92%'
  },
  forgotText: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeRegular,
    marginRight: '5%',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '40%',
  },
  signUpText: {
    fontSize: 16,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
  },
  signUpLink: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeRegular,
    marginRight: '5%',
  },
  footerText: {
    fontSize: 12,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
    alignSelf: 'center',
    marginTop: '15%',
  },
  separator:{
    height:20
  },
  input: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 6,
    marginTop: '3%',
    paddingLeft: 20,
    marginHorizontal:"8%"
  },



  container2: {
    marginHorizontal: '5%',
    marginTop:15
  },
  label2: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
  },
  input: {
    fontSize: 16,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 6,
    marginTop: '3%',
    paddingLeft: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
marginLeft:25,
marginTop:5
  
  },
})
