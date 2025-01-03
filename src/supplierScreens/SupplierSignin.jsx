import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import themeStyle, { FONT } from '../styles/themeStyle'
import GlobalInput from '../components/GlobalInput'
import PasswordInput from '../components/PasswordInput'
import GlobalButton from '../components/GlobalButton'
import { ROUTES } from '../routes/RoutesConstants'
import Snackbar from 'react-native-snackbar'
import { BaseurlSupplier } from '../Apis/apiConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BackButton from '../components/BackButton'

export default function SupplierSignin({navigation}) {
  const [tick, settick] = useState(true)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [loading, setloading] = useState(false)
  const toggletick = () => {
    settick(!tick)
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      Snackbar.show({
        text: 'Enter both email and password',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
    } else {
      setloading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        email: email,
        password: password,
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
  
      try {
        const response = await fetch(`${BaseurlSupplier}login`, requestOptions);
        const result = await response.json();
        console.log(result);
  
   
  
        setloading(false);
  
        if (result?.success === true) {
          await AsyncStorage.setItem('supplierToken', result?.token);
          await AsyncStorage.setItem('supplierId', result?.user?._id);
          navigation.replace(ROUTES.SupplierHome);
        }else{
          Snackbar.show({
            text: result?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'rgba(212, 4, 28, 1)',
            textColor: 'white',
            marginBottom: 0,
          });
        }
      } catch (error) {
        console.error(error);
        setloading(false);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView>
        <BackButton/>
      <Header title={'Welcome back!'} description={'Please log in to continue using this app.'} />

      <GlobalInput onChangeText={setEmail} title={'Email Address'} hint={'Enter your email address'} marginTop={'10%'} />
      <PasswordInput onChangeText={setPassword} hint={'Enter Password'} title={'Password'} />
      
      <View style={styles.rememberContainer}>
        <TouchableOpacity onPress={toggletick} style={styles.rememberButton}>
          <View style={[styles.tickBox, { backgroundColor: tick ? themeStyle.PRIMARY_COLOR : themeStyle.WHITE, borderWidth: tick ? 0 : 1 }]}>
            {tick && <Image style={styles.tickImage} source={require('../../assets/images/OnBoarding/tick.png')} />}
          </View>
          <Text style={styles.rememberText}>Remember Me!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{left:18}} onPress={()=>navigation.navigate(ROUTES.SupplierResetpassword)}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <GlobalButton loading={loading} onPress={handleSignIn} title={'Sign In'} marginTop={'8%'} />

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate(ROUTES.SupplierSignup)}>
          <Text style={styles.signUpLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}> © 2024 MeatMe Halfway</Text>
      <View style={styles.separator}/>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.PRIMARY_LIGHT,
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
    fontSize: 16,
    color: themeStyle.MEDIUM_BLACK,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
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
    marginTop: '20%',
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
  }
})
